import { IsString, IsInt, IsOptional, Min, Max, IsEnum } from 'class-validator';
import { Condition, Region, OwnershipStatus } from '@prisma/client';

export class CreateCollectionDto {
  @IsString()
  gameId: string;

  @IsEnum(Condition)
  @IsOptional()
  condition?: Condition;

  @IsEnum(Region)
  @IsOptional()
  region?: Region;

  @IsEnum(OwnershipStatus)
  @IsOptional()
  ownershipStatus?: OwnershipStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  personalRating?: number;

  @IsOptional()
  estimatedValue?: number;

  @IsString()
  @IsOptional()
  coverImage?: string;
}
