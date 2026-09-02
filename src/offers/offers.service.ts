import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Wish } from '@/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  // Базовые CRUD-методы (без бизнес-проверок)

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const offer = this.offersRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden ?? false,
      user: { id: userId },
      item: { id: createOfferDto.itemId },
    });

    return this.offersRepository.save(offer);
  }

  async findOne(query: FindOptionsWhere<Offer>): Promise<Offer | null> {
    return this.offersRepository.findOne({ where: query });
  }

  async findMany(query: FindOptionsWhere<Offer>): Promise<Offer[]> {
    return this.offersRepository.find({ where: query });
  }

  async updateOne(
    query: FindOptionsWhere<Offer>,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer> {
    const offer = await this.findOne(query);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    Object.assign(offer, updateOfferDto);

    return this.offersRepository.save(offer);
  }

  async removeOne(query: FindOptionsWhere<Offer>): Promise<Offer> {
    const offer = await this.findOne(query);

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return this.offersRepository.remove(offer);
  }

  // Бизнес-методы (проверки + вызов базовых CRUD)

  async createOffer(
    createOfferDto: CreateOfferDto,
    userId: number,
  ): Promise<Offer> {
    const wish = await this.wishesRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Нельзя скинуться на собственный подарок');
    }

    const raised = Number(wish.raised) || 0;
    const amount = Number(createOfferDto.amount);
    const price = Number(wish.price);

    if (raised + amount > price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    const offer = await this.create(createOfferDto, userId);

    wish.raised = raised + amount;
    await this.wishesRepository.save(wish);

    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({
      relations: { item: true, user: true },
    });
  }

  async findOfferById(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: { item: true, user: true },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return offer;
  }
}
