import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { validateConfig, getCorsOrigin } from './config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  validateConfig(configService);

  // Security headers
  app.use(helmet());

  // CORS from environment
  app.enableCors({
    origin: getCorsOrigin(configService),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Body size limits — prevent large payload abuse
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // Request timeout
  app.use((req: any, _res: any, next: any) => {
    req.setTimeout(30000, () => {
      if (!req.res.headersSent) {
        req.res.status(408).json({ statusCode: 408, message: 'Request timeout' });
      }
    });
    next();
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
