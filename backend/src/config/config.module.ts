import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}

export function validateConfig(configService: ConfigService): void {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = requiredVars.filter(
    (key) => !configService.get<string>(key),
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please check your .env file.',
    );
  }

  const jwtSecret = configService.get<string>('JWT_SECRET');
  if (jwtSecret === 'change-me-to-a-secure-random-string') {
    console.warn(
      'WARNING: JWT_SECRET is set to the default placeholder value. ' +
      'Change it to a secure random string in production.',
    );
  }
}

export function getCorsOrigin(configService: ConfigService): string[] {
  const origin = configService.get<string>('CORS_ORIGIN');
  if (!origin) return ['http://localhost:5173'];
  return origin.split(',').map((o) => o.trim());
}
