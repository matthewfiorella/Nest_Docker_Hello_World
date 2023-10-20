import { Test, TestingModule } from '@nestjs/testing';
import { PostalController } from './postal.controller';

describe('PostalController', () => {
  let controller: PostalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostalController],
    }).compile();

    controller = module.get<PostalController>(PostalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
