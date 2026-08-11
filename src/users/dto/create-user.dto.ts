import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(0, 200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar = 'https://i.pravatar.cc/300';

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
