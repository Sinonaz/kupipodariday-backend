import { Wish } from '@/wishes/entities/wish.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish) private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, ownerId: number) {
    const { itemsId, ...rest } = createWishlistDto;

    const items = itemsId?.length
      ? await this.wishesRepository.find({ where: { id: In(itemsId) } })
      : [];

    const wishlist = this.wishlistsRepository.create({
      ...rest,
      description: '',
      items,
      owner: { id: ownerId },
    });

    return await this.wishlistsRepository.save(wishlist);
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistsRepository.findOne({ where: { id } });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async findAll() {
    return await this.wishlistsRepository.find();
  }

  async updateOne(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findByIdOrFail(id, true);
    const { itemsId, ...rest } = updateWishlistDto;

    Object.assign(wishlist, rest);

    if (itemsId) {
      wishlist.items = await this.wishesRepository.find({
        where: { id: In(itemsId) },
      });
    }

    return await this.wishlistsRepository.save(wishlist);
  }

  async removeOne(id: number) {
    const wishlist = await this.findByIdOrFail(id);

    return await this.wishlistsRepository.remove(wishlist);
  }

  private async findByIdOrFail(id: number, withItems = false) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: withItems ? { items: true } : undefined,
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with id ${id} not found`);
    }

    return wishlist;
  }
}
