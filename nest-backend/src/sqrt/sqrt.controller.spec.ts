import { Test, TestingModule } from '@nestjs/testing';
import { SqrtController } from './sqrt.controller';
import { SqrtService } from './sqrt.service';

describe('SqrtController', () => {
  let controller: SqrtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqrtService],
      controllers: [SqrtController],
    }).compile();

    controller = module.get<SqrtController>(SqrtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
