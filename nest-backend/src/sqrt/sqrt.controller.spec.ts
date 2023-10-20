import { Test, TestingModule } from '@nestjs/testing';
import { SqrtController } from './sqrt.controller';

describe('SqrtController', () => {
  let controller: SqrtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SqrtController],
    }).compile();

    controller = module.get<SqrtController>(SqrtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
