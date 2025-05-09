import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Word } from 'src/words/entities/word.entity';
import { UserWord } from 'src/user-word/entities/user-word.entity';
import { UserWordModule } from 'src/user-word/user-word.module'; // ✅ importar módulo
import { Attempt } from './entities/attempt.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Word, UserWord, Attempt]),
    UserWordModule, // ✅ Importar el módulo que contiene el repo de UserWord
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
