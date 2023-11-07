import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { PostalController } from './postal.controller';
import { PostalService } from './postal.service';

describe('PostalController', () => {
  let controller: PostalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PostalController],
      providers: [PostalService]
    }).compile();

    controller = module.get<PostalController>(PostalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
