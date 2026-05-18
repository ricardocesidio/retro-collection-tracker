import { IsInt, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class UpdateWishlistDto {
  @IsInt()
  @Min(0)
  @Max(3)
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedValue?: number;
}
