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
  ParseIntPipe,
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: User },
  ) {
    this.ensureOwner(req.user.id, id);

    return this.usersService.updateOne(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeOne(@Param('id', ParseIntPipe) id: number, @Req() req: { user: User }) {
    this.ensureOwner(req.user.id, id);

    return this.usersService.removeOne(+id);
  }

  private ensureOwner(currentUserId: number, targetId: number) {
    if (currentUserId !== targetId) {
      throw new ForbiddenException('You do not have rights to do this action');
    }
  }
}
