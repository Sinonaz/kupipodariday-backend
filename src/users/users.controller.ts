import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '@/auth/guards/ownership.guard';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnershipGuard)
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeOne(id);
  }
}
