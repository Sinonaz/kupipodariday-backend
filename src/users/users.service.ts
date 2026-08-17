import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds =
      Number(this.configService.get<string>('HASH_SALT', '10')) || 10;

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    return await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOne(query: FindOptionsWhere<User>) {
    return await this.usersRepository.findOne({ where: query });
  }

  updateOne(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeOne(id: number) {
    return `This action removes a #${id} user`;
  }
}
