import { Test, TestingModule } from '@nestjs/testing';
import { SqrtService } from './sqrt.service';

describe('SqrtService', () => {
  let service: SqrtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqrtService],
    }).compile();

    service = module.get<SqrtService>(SqrtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
