import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private saltRounds: number;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.saltRounds =
      Number(this.configService.get<string>('HASH_SALT', '10')) || 10;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    return await this.usersRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOne(query: FindOptionsWhere<User>) {
    return await this.usersRepository.findOne({ where: query });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...rest } = updateUserDto;
    const data: Partial<User> = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, this.saltRounds);
    }

    Object.assign(user, data);

    return await this.usersRepository.save(user);
  }

  removeOne(id: number) {
    return `This action removes a #${id} user`;
  }
}
