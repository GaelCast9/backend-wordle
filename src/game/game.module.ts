import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Word } from 'src/words/entities/word.entity';
import { UserWord } from 'src/user-word/entities/user-word.entity';
import { UserWordModule } from 'src/user-word/user-word.module'; 
import { Attempt } from './entities/attempt.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([User, Word, UserWord, Attempt]),
    UserWordModule, 
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
