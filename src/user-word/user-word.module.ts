import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWord } from './entities/user-word.entity';
import { UserWordService } from './user-word.service';
import { UserWordController } from './user-word.controller';
import { User } from 'src/users/entities/user.entity';
import { Word } from 'src/words/entities/word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserWord, User, Word])],
  controllers: [UserWordController],
  providers: [UserWordService],
  exports: [TypeOrmModule], // ✅ Exporta para que GameModule lo pueda usar
})
export class UserWordModule {}
