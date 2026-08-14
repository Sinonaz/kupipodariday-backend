import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  create(createWishlistDto: CreateWishlistDto) {
    return 'This action adds a new wishlist';
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  updateOne(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  removeOne(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
