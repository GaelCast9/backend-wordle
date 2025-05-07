import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserWordService } from './user-word.service';
import { Word } from 'src/words/entities/word.entity';

@Controller('user-word')
export class UserWordController {
  constructor(private readonly userWordService: UserWordService) {}

  @Get('random/:userId')
  async getRandomWord(@Param('userId') userId: number): Promise<Word> {
    const word = await this.userWordService.getRandomWordForUser(userId);

    if (!word) {
      throw new NotFoundException('No more words available for this user');
    }

    return word;
  }
}
