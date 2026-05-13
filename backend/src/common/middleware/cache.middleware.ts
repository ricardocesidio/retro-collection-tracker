import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const cacheablePaths = ['/api/games', '/api/games/platforms', '/api/games/genres', '/api/stats/public'];

    const isCacheable = cacheablePaths.some((path) => req.path.startsWith(path));

    if (isCacheable && req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    }

    next();
  }
}
