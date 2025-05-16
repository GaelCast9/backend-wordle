import { Test, TestingModule } from '@nestjs/testing';
import { WordsService } from './words.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';

describe('WordsService', () => {
  let service: WordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: getRepositoryToken(Word),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WordsService>(WordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
