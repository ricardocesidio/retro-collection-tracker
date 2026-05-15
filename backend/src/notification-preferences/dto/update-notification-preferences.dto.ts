import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @IsBoolean()
  @IsOptional()
  email?: boolean;

  @IsBoolean()
  @IsOptional()
  push?: boolean;

  @IsBoolean()
  @IsOptional()
  follows?: boolean;

  @IsBoolean()
  @IsOptional()
  reviews?: boolean;

  @IsBoolean()
  @IsOptional()
  wishlist?: boolean;
}
