import { Test, TestingModule } from '@nestjs/testing';
import { UserWordService } from './user-word.service';

describe('UserWordService', () => {
  let service: UserWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWordService],
    }).compile();

    service = module.get<UserWordService>(UserWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
