import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne Works', async () => {
    expect((await service.findOne("testdummy")).success).toBe(true) // Sample User does in fact exist
    expect((await service.findOne("Idontexist")).success).toBe(false) // user that doesn't exist is proven to not exist
  })

  it('registerUser Works', async() => {
      const dummyUser = String(Date.now()) // Should be a unique userId
      await service.registerUser("dummyemail@dummyemail.com", dummyUser, "dummy_hashed_password")
      expect((await service.findOne(dummyUser)).success).toBe(true) // New user is registered
      expect((await service.registerUser("dummyemail@dummyemail.com", dummyUser, "dummy_hashed_password")).success).toBe(false) // Can't Register same user twice
  })

  it('authUser Works', async () => {
    expect(await service.authUser("testdummy", "Dummy123!")).not.toBe(null) // Successfully auth dummy user to cognito
    expect(await service.authUser("testdummy", "NotThePassword")).toBe(null) // Unsuccessfully auth dummy user to cognito
  , 20000})
});
