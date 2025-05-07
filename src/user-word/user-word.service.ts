import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { UserWord } from './entities/user-word.entity';
import { User } from 'src/users/entities/user.entity';
import { Word } from 'src/words/entities/word.entity';

@Injectable()
export class UserWordService {
  constructor(
    @InjectRepository(UserWord)
    private readonly userWordRepo: Repository<UserWord>,

    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Método que obtiene una palabra aleatoria que el usuario NO haya jugado antes
  async getRandomWordForUser(userId: number): Promise<Word | null> {
    // 1. Obtener IDs de palabras ya jugadas por el usuario
    const userPlayedWords = await this.userWordRepo.find({
      where: { user: { id: userId } },
      relations: ['word'],
    });

    const usedWordIds = userPlayedWords.map(uw => uw.word.id);

    // 2. Buscar palabras que NO estén en la lista de usadas
    const availableWords = await this.wordRepo.find({
      where: usedWordIds.length > 0 ? { id: Not(In(usedWordIds)) } : {},
    });

    if (availableWords.length === 0) {
      return null; // Ya no hay palabras disponibles
    }

    // 3. Escoger una palabra aleatoria del resultado
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];

    // 4. Cargar el usuario completo
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;

    // 5. Registrar la palabra como usada
    const userWord = this.userWordRepo.create({
      user,
      word: selectedWord,
    });

    await this.userWordRepo.save(userWord);

    // 6. Retornar la palabra
    return selectedWord;
  }
}
