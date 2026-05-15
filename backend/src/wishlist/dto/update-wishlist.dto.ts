import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateWishlistDto {
  @IsInt()
  @Min(0)
  @Max(3)
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
