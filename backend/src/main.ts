import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { validateConfig, getCorsOrigin } from './config/config.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  validateConfig(configService);

  const uploadDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });
  app.useStaticAssets(uploadDir, { prefix: '/uploads' });

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

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Retro Collection Tracker API')
    .setDescription('API for managing retro game collections, users, reviews, and social features')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('games', 'Game catalog')
    .addTag('collections', 'User collections')
    .addTag('wishlist', 'Wishlist management')
    .addTag('reviews', 'Game reviews')
    .addTag('social', 'Follow/unfollow functionality')
    .addTag('notifications', 'Notification system')
    .addTag('notification-preferences', 'Notification preferences')
    .addTag('activity', 'User activity feed')
    .addTag('stats', 'Collection statistics')
    .addTag('admin', 'Admin-only endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
}
bootstrap();
