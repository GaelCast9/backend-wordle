import { Test, TestingModule } from '@nestjs/testing';
import { UserWordController } from './user-word.controller';
import { UserWordService } from './user-word.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserWord } from './entities/user-word.entity';
import { Word } from 'src/words/entities/word.entity';
import { User } from 'src/users/entities/user.entity';

describe('UserWordController', () => {
  let controller: UserWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWordController],
      providers: [
        UserWordService,
        { provide: getRepositoryToken(UserWord), useValue: {} },
        { provide: getRepositoryToken(Word), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    controller = module.get<UserWordController>(UserWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
