import { IsEmail, IsString, Length } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail()
  readonly newEmail: string;
}