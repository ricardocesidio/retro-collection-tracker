import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  gameId: string;

  @IsInt()
  @Min(0)
  @Max(3)
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
