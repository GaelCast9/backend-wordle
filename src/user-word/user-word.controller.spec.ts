import { Test, TestingModule } from '@nestjs/testing';
import { UserWordController } from './user-word.controller';
import { UserWordService } from './user-word.service';

describe('UserWordController', () => {
  let controller: UserWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWordController],
      providers: [UserWordService],
    }).compile();

    controller = module.get<UserWordController>(UserWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
