import {
  Controller, Post, Param, UseGuards, Request, UseInterceptors,
  UploadedFile, BadRequestException, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

const imageInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: join(process.cwd(), 'uploads'),
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + extname(file.originalname));
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|webp|gif)$/)) {
      cb(new BadRequestException('Only jpg, png, webp, gif allowed'), false);
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

@Controller('upload')
export class UploadController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(imageInterceptor)
  async uploadAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const url = `/uploads/${file.filename}`;
    await this.prisma.user.update({ where: { id: req.user.id }, data: { avatarUrl: url } });
    return { url };
  }

  @Post('cover/:gameId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(imageInterceptor)
  async uploadGameCover(
    @Param('gameId') gameId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Game not found');
    const url = `/uploads/${file.filename}`;
    await this.prisma.game.update({ where: { id: gameId }, data: { coverImageUrl: url } });
    return { url };
  }

  @Post('collection-cover/:colId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(imageInterceptor)
  async uploadCollectionCover(
    @Param('colId') colId: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const entry = await this.prisma.collection.findUnique({ where: { id: colId } });
    if (!entry) throw new NotFoundException('Collection entry not found');
    if (entry.userId !== req.user.id) throw new ForbiddenException('Not your collection entry');
    const url = `/uploads/${file.filename}`;
    await this.prisma.collection.update({ where: { id: colId }, data: { coverImage: url } });
    return { url };
  }
}
