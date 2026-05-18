import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface ExternalGameResult {
  source: 'rawg' | 'wikipedia';
  sourceId: string;
  title: string;
  releaseYear?: number;
  platform?: string;
  genre?: string;
  description?: string;
  coverImageUrl?: string;
  developer?: string;
  publisher?: string;
  rating?: number;
  metacritic?: number;
}

@Injectable()
export class ExternalGamesService {
  private readonly logger = new Logger(ExternalGamesService.name);
  private readonly rawgKey: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.rawgKey = this.config.get<string>('RAWG_API_KEY') || '';
  }

  async search(
    query: string,
    page = 1,
  ): Promise<{ results: ExternalGameResult[]; total: number; source: string }> {
    if (this.rawgKey) {
      try {
        const { results, total } = await this.searchRawg(query, page);
        return { results, total, source: 'rawg' };
      } catch (err) {
        this.logger.warn(
          `RAWG search failed, falling back to Wikipedia: ${err}`,
        );
      }
    }

    if (!query || query.trim().length < 2) {
      return { results: [], total: 0, source: 'none' };
    }

    try {
      const results = await this.searchWikipedia(query);
      return { results, total: results.length, source: 'wikipedia' };
    } catch (err) {
      this.logger.error(`Wikipedia search also failed: ${err}`);
      return { results: [], total: 0, source: 'none' };
    }
  }

  private async searchRawg(
    query: string,
    page: number,
  ): Promise<{ results: ExternalGameResult[]; total: number }> {
    const baseUrl = query
      ? `https://api.rawg.io/api/games?key=${this.rawgKey}&search=${encodeURIComponent(query)}&page_size=24&page=${page}`
      : `https://api.rawg.io/api/games?key=${this.rawgKey}&page_size=24&page=${page}&ordering=-rating`;
    const url = baseUrl;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`RAWG API returned ${res.status}`);
    const data = await res.json();

    return {
      total: data.count || 0,
      results: (data.results || []).map((g: any) => ({
        source: 'rawg' as const,
        sourceId: String(g.id),
        title: g.name,
        releaseYear: g.released ? parseInt(g.released.slice(0, 4)) : undefined,
        platform: g.platforms?.[0]?.platform?.name || undefined,
        genre: g.genres?.[0]?.name || undefined,
        description: g.description_raw?.slice(0, 500) || undefined,
        coverImageUrl: g.background_image || undefined,
        rating: g.rating || undefined,
        metacritic: g.metacritic || undefined,
      })),
    };
  }

  private async searchWikipedia(query: string): Promise<ExternalGameResult[]> {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' video game')}&format=json&srlimit=20&origin=*`;
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error(`Wikipedia search returned ${res.status}`);
    const data = await res.json();

    const results = data.query?.search || [];
    if (results.length === 0) return [];

    const pageIds = results
      .slice(0, 10)
      .map((r: any) => r.pageid)
      .join('|');
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageIds}&format=json&origin=*`;
    const extRes = await fetch(extractUrl);
    const extData = await extRes.json();
    const pages = extData.query?.pages || {};

    return results.slice(0, 10).map((r: any) => {
      const page = pages[r.pageid];
      return {
        source: 'wikipedia' as const,
        sourceId: String(r.pageid),
        title: r.title,
        description: page?.extract?.slice(0, 500) || undefined,
      };
    });
  }

  async import(
    source: string,
    sourceId: string,
  ): Promise<{ id: string; title: string }> {
    const existing = await this.prisma.game.findFirst({
      where: { title: `__ext_${source}_${sourceId}` },
    });
    if (existing)
      return {
        id: existing.id,
        title: existing.title.replace(/^__ext_[a-z]+_/, ''),
      };

    let details: Partial<ExternalGameResult> = {};

    if (source === 'rawg' && this.rawgKey) {
      details = await this.importFromRawg(sourceId);
    } else if (source === 'wikipedia') {
      details = await this.importFromWikipedia(sourceId);
    } else {
      throw new BadRequestException('No external source available');
    }

    if (!details.title)
      throw new BadRequestException('Could not fetch game details');

    let platformId = undefined as string | undefined;
    let genreId = undefined as string | undefined;

    if (details.platform) {
      platformId = await this.resolvePlatform(details.platform);
    }
    if (details.genre) {
      genreId = await this.resolveGenre(details.genre);
    }

    const game = await this.prisma.game.create({
      data: {
        title: details.title,
        platformId: platformId || (await this.getDefaultPlatform()).id,
        genreId: genreId || (await this.getDefaultGenre()).id,
        releaseYear: details.releaseYear || 2000,
        developer: details.developer,
        publisher: details.publisher,
        description: details.description,
        coverImageUrl: details.coverImageUrl,
      },
    });

    return { id: game.id, title: details.title };
  }

  private async importFromRawg(
    sourceId: string,
  ): Promise<Partial<ExternalGameResult>> {
    const url = `https://api.rawg.io/api/games/${sourceId}?key=${this.rawgKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`RAWG detail API returned ${res.status}`);
    const g = await res.json();

    return {
      title: g.name,
      releaseYear: g.released ? parseInt(g.released.slice(0, 4)) : undefined,
      platform: g.platforms?.[0]?.platform?.name || undefined,
      genre: g.genres?.[0]?.name || undefined,
      description: g.description_raw?.slice(0, 500) || undefined,
      coverImageUrl: g.background_image || undefined,
      developer: g.developers?.[0]?.name || undefined,
      publisher: g.publishers?.[0]?.name || undefined,
      rating: g.rating || undefined,
      metacritic: g.metacritic || undefined,
    };
  }

  private async importFromWikipedia(
    sourceId: string,
  ): Promise<Partial<ExternalGameResult>> {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${sourceId}&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const page = data.query?.pages?.[sourceId];
    if (!page) throw new BadRequestException('Wikipedia page not found');

    return {
      title: page.title,
      description: page.extract?.slice(0, 500) || undefined,
    };
  }

  private async resolvePlatform(name: string): Promise<string | undefined> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const existing = await this.prisma.platform.findFirst({
      where: {
        OR: [{ name: { contains: name, mode: 'insensitive' } }, { slug }],
      },
    });
    if (existing) return existing.id;
    return undefined;
  }

  private async resolveGenre(name: string): Promise<string | undefined> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const existing = await this.prisma.genre.findFirst({
      where: {
        OR: [{ name: { contains: name, mode: 'insensitive' } }, { slug }],
      },
    });
    if (existing) return existing.id;
    return undefined;
  }

  private async getDefaultPlatform() {
    const p = await this.prisma.platform.findFirst({
      orderBy: { name: 'asc' },
    });
    if (!p) throw new Error('No platforms in database. Run seed first.');
    return p;
  }

  private async getDefaultGenre() {
    const g = await this.prisma.genre.findFirst({ orderBy: { name: 'asc' } });
    if (!g) throw new Error('No genres in database. Run seed first.');
    return g;
  }
}
