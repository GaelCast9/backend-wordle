import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserWord } from 'src/user-word/entities/user-word.entity';
import { Word } from 'src/words/entities/word.entity';
import { Repository, Not, In } from 'typeorm';

@Injectable()
export class WordRotationService {
  private readonly logger = new Logger(WordRotationService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Word)
    private wordRepo: Repository<Word>,

    @InjectRepository(UserWord)
    private userWordRepo: Repository<UserWord>,
  ) {}

  @Cron('*/5 * * * *') // ⏱ Cada 5 minutos
  async assignWordsToAllUsers() {
    this.logger.log('Ejecutando tarea programada: asignar palabras nuevas');

    const users = await this.userRepo.find();

    for (const user of users) {
      const usedWords = await this.userWordRepo.find({
        where: { user: { id: user.id } },
        relations: ['word'],
      });

      const usedWordIds = usedWords.map(uw => uw.word.id);

      const availableWords = await this.wordRepo.find({
        where: usedWordIds.length > 0 ? { id: Not(In(usedWordIds)) } : {},
      });

      if (availableWords.length === 0) continue;

      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];

      const userWord = this.userWordRepo.create({
        user,
        word: randomWord,
      });

      await this.userWordRepo.save(userWord);
    }

    this.logger.log('✅ Palabras asignadas a todos los usuarios.');
  }
}
