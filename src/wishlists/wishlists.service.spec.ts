import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';

describe('WishlistsService', () => {
  let service: WishlistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
