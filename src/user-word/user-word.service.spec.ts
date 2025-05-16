import { Test, TestingModule } from '@nestjs/testing';
import { UserWordService } from './user-word.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserWord } from './entities/user-word.entity';
import { Word } from 'src/words/entities/word.entity';
import { User } from 'src/users/entities/user.entity';

describe('UserWordService', () => {
  let service: UserWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserWordService,
        {
          provide: getRepositoryToken(UserWord),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Word),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserWordService>(UserWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
