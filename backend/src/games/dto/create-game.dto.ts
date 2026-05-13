import { IsString, IsInt, IsOptional, Min, Max, IsUrl } from 'class-validator';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsString()
  platformId: string;

  @IsString()
  genreId: string;

  @IsInt()
  @Min(1950)
  @Max(2030)
  releaseYear: number;

  @IsString()
  @IsOptional()
  developer?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;
}
