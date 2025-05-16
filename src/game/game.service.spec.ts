import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserWord } from 'src/user-word/entities/user-word.entity';
import { Word } from 'src/words/entities/word.entity';
import { User } from 'src/users/entities/user.entity';
import { Attempt } from './entities/attempt.entity';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(UserWord),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Word),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Attempt),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
