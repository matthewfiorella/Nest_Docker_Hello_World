import { Test, TestingModule } from '@nestjs/testing';
import { PostalService } from './postal.service';
import { PostalController } from './postal.controller';
import { HttpModule } from '@nestjs/axios';
import { InputStrDTO } from './dto/input.dto';

describe('PostalService', () => {
  let service: PostalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PostalController],
      providers: [PostalService],
    }).compile();

    service = module.get<PostalService>(PostalService);
  });

  it('Lookup Tests', async () => {
    expect(service).toBeDefined();

    const test1 = "Kensington and Chelsea"
    const input1 = new InputStrDTO("sw72dh")
    const result1 = await service.lookup(input1)
    expect(test1).toBe(result1)

    const test2 = "Not a Valid Postal Code!"
    const input2 = new InputStrDTO("Nonsense")
    const result2 = await service.lookup(input2)
    expect(test2).toBe(result2)

    const test3 = "North Tyneside"
    const input3 = new InputStrDTO("NE26 3AZ")
    const result3 = await service.lookup(input3)
    expect(test3).toBe(result3)
  });

  it('Database Tests', async () => {
      await service.writeDB("Kensington and Chelsea", new InputStrDTO("sw72dh"))
      await service.writeDB("North Tyneside", new InputStrDTO("NE26 3AZ"))
      await service.writeDB("Not a Valid Postal Code!", new InputStrDTO("Nonsense"))
      await service.writeDB("Lambeth", new InputStrDTO("sw25uy"))
      await service.writeDB("Not a Valid Postal Code!", new InputStrDTO("Hi"))

      const history = (await service.readDB()).Items

      expect(history[4].PrimaryHealthcareTrust.S).toBe("Kensington and Chelsea")
      expect(history[4].PostalCode.S).toBe("sw72dh")

      expect(history[3].PrimaryHealthcareTrust.S).toBe("North Tyneside")
      expect(history[3].PostalCode.S).toBe("NE26 3AZ")

      expect(history[2].PrimaryHealthcareTrust.S).toBe("Not a Valid Postal Code!")
      expect(history[2].PostalCode.S).toBe("Nonsense")

      expect(history[1].PrimaryHealthcareTrust.S).toBe("Lambeth")
      expect(history[1].PostalCode.S).toBe("sw25uy")

      expect(history[0].PrimaryHealthcareTrust.S).toBe("Not a Valid Postal Code!")
      expect(history[0].PostalCode.S).toBe("Hi")
  })
});
