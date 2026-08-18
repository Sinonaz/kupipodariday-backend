import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne({ id: +id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: User },
  ) {
    if (req.user.id !== +id) {
      throw new ForbiddenException(
        'You do not have rights to update this profile',
      );
    }

    return await this.usersService.updateOne(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeOne(@Param('id') id: string, @Req() req: { user: User }) {
    if (req.user.id !== +id) {
      throw new ForbiddenException(
        'You do not have rights to delete this profile',
      );
    }

    return await this.usersService.removeOne(+id);
  }
}
