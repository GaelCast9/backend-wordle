import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { Word } from './entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  async create(createWordDto: CreateWordDto): Promise<Word> {
    const word = this.wordRepository.create(createWordDto);
    return this.wordRepository.save(word);
  }

  async findAll(): Promise<Word[]> {
    return this.wordRepository.find();
  }

  async findOne(id: number): Promise<Word | null> {
    return this.wordRepository.findOne({ where: { id } });
  }

  async update(id: number, updateWordDto: UpdateWordDto): Promise<Word | null> {
    await this.wordRepository.update(id, updateWordDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.wordRepository.delete(id);
  }

  // 🧠 Método adicional: obtener una palabra aleatoria
  async getRandomWord(): Promise<Word | null> {
    const count = await this.wordRepository.count();
    if (count === 0) return null;

    const randomIndex = Math.floor(Math.random() * count);
    const [randomWord] = await this.wordRepository.find({ skip: randomIndex, take: 1 });
    return randomWord;
  }
}
