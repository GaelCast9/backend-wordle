import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { Repository, Not, In } from 'typeorm';
import { UserWord } from 'src/user-word/entities/user-word.entity';
import { Word } from 'src/words/entities/word.entity';
import { User } from 'src/users/entities/user.entity';
import { Attempt } from './entities/attempt.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordRepo: Repository<UserWord>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,

    @InjectRepository(Attempt)
    private readonly attemptRepo: Repository<Attempt>,
  ) {}

  async checkGuess(userId: number, dto: CreateGameDto): Promise<any> {
    const guess = dto.guess.toUpperCase();

    const latestUserWord = await this.userWordRepo.findOne({
      where: { user: { id: userId } },
      relations: ['word'],
      order: { createdAt: 'DESC' },
    });

    if (!latestUserWord) {
      return 'No hay palabra asignada a este usuario.';
    }

    if (latestUserWord.isCorrect) {
      return 'Ya adivinaste esta palabra correctamente.';
    }

    const attempts = await this.attemptRepo.count({
      where: { userWord: { id: latestUserWord.id } },
    });

    if (attempts >= 5) {
      return 'Ya alcanzaste el máximo de intentos para esta palabra.';
    }

    const attempt = this.attemptRepo.create({
      userWord: latestUserWord,
      guess,
    });

    await this.attemptRepo.save(attempt);

    const target = latestUserWord.word.word.toUpperCase();
    const result: { letter: string; value: number }[] = [];
    const targetLetters = target.split('');
    const matchedPositions = Array(5).fill(false);

    for (let i = 0; i < 5; i++) {
      if (guess[i] === target[i]) {
        result.push({ letter: guess[i], value: 1 });
        matchedPositions[i] = true;
      } else {
        result.push({ letter: guess[i], value: 3 });
      }
    }

    for (let i = 0; i < 5; i++) {
      if (result[i].value === 3) {
        const idx = targetLetters.findIndex((ltr, j) => ltr === guess[i] && !matchedPositions[j]);
        if (idx !== -1) {
          result[i].value = 2;
          matchedPositions[idx] = true;
        }
      }
    }

    const won = result.every(letter => letter.value === 1);

    if (won) {
      latestUserWord.isCorrect = true;
      await this.userWordRepo.save(latestUserWord);
    }

    return {
      result,
      won,
      message: won ? '¡Felicidades! Adivinaste la palabra.' : undefined,
    };
  }

  // ✅ Nuevo método: asignar nueva palabra si ya terminó la anterior
  async assignNextWord(userId: number): Promise<any> {
    const lastWord = await this.userWordRepo.findOne({
      where: { user: { id: userId } },
      relations: ['word'],
      order: { createdAt: 'DESC' },
    });

    if (lastWord) {
      const isFinished = lastWord.isCorrect ||
        (await this.attemptRepo.count({ where: { userWord: { id: lastWord.id } } })) >= 5;

      if (!isFinished) {
        return {
          message: 'Todavía tienes una palabra activa.',
          currentWordId: lastWord.word.id,
        };
      }
    }

    const previousWords = await this.userWordRepo.find({
      where: { user: { id: userId } },
      relations: ['word'],
    });

    const usedWordIds = previousWords.map(pw => pw.word.id);

    const availableWords = await this.wordRepo.find({
      where: usedWordIds.length > 0 ? { id: Not(In(usedWordIds)) } : {},
    });

    if (availableWords.length === 0) {
      return { message: 'Ya no hay más palabras disponibles para ti.' };
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];

    const newUserWord = this.userWordRepo.create({
      user: { id: userId },
      word: { id: randomWord.id },
    });

    await this.userWordRepo.save(newUserWord);

    return {
      message: 'Nueva palabra asignada.',
      wordId: randomWord.id,
    };
  }
}
