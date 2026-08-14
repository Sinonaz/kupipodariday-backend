import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  about = 'Пока ничего не рассказал о себе';

  @IsOptional()
  @IsUrl()
  avatar = 'https://i.pravatar.cc/300';

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
