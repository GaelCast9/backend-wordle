import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWordService } from './user-word.service';
import { UserWordController } from './user-word.controller';
import { UserWord } from './entities/user-word.entity';
import { User } from 'src/users/entities/user.entity';
import { Word } from 'src/words/entities/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserWord, User, Word])],
  controllers: [UserWordController],
  providers: [UserWordService],
  exports: [UserWordService], // Esto es útil si quieres usarlo desde otros módulos
})
export class UserWordModule {}
