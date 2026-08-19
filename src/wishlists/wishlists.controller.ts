import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistOwnershipGuard } from './guards/wishlist-ownership.guard';
import { WishlistsService } from './wishlists.service';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, WishlistOwnershipGuard)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne(id, updateWishlistDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, WishlistOwnershipGuard)
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.removeOne(id);
  }
}
