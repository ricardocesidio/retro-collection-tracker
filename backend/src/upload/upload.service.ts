import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname, join } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

@Injectable()
export class UploadService {
  private s3: S3Client | null = null;
  private bucket: string = '';
  private publicUrl: string = '';

  constructor(private config: ConfigService) {
    const endpoint = this.config.get<string>('R2_ENDPOINT');
    const key = this.config.get<string>('R2_ACCESS_KEY');
    const secret = this.config.get<string>('R2_SECRET_KEY');
    if (endpoint && key && secret) {
      this.bucket = this.config.get<string>('R2_BUCKET') ?? 'retro-collection-tracker';
      this.publicUrl = this.config.get<string>('R2_PUBLIC_URL') ?? '';
      this.s3 = new S3Client({
        region: 'auto',
        endpoint,
        credentials: { accessKeyId: key, secretAccessKey: secret },
      });
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    if (this.s3) {
      const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));
      return `${this.publicUrl}/${key}`;
    }
    const dir = join(process.cwd(), 'uploads');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    writeFileSync(join(dir, filename), file.buffer);
    return `/uploads/${filename}`;
  }
}
