import { Test, TestingModule } from '@nestjs/testing';
import { SqrtService } from './sqrt.service';
import { InputStrDTO } from './dto/input.dto';
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

  it('Calc Sqrt Works', async () => {
    expect(await service.calcSqrt(new InputStrDTO("4"))).toBe(2)
    expect(await service.calcSqrt(new InputStrDTO("1456"))).toBe(Math.sqrt(1456))
    expect(await service.calcSqrt(new InputStrDTO("random"))).toBe(NaN)
  })
});
