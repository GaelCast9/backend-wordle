import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserWord } from 'src/user-word/entities/user-word.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserWord)
    private userWordRepo: Repository<UserWord>, // ✅ nuevo
  ) { }


  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...user }) => user);
  }


  async findOne(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;

    // Excluir manualmente el campo password
    const { password, ...safeUser } = user;
    return safeUser;
  }


  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'> | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }


  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getStats(userId: number) {
    const totalGames = await this.userWordRepo.count({
      where: { user: { id: userId } },
    });

    const totalVictories = await this.userWordRepo.count({
      where: { user: { id: userId }, isCorrect: true },
    });

    return { totalGames, totalVictories };
  }

  async getTop10(): Promise<{ username: string; victories: number }[]> {
    const raw = await this.userWordRepo
      .createQueryBuilder('user_word')
      .leftJoin('user_word.user', 'user')
      .select('user.username', 'username')
      .addSelect('COUNT(*)', 'victories')
      .where('user_word.isCorrect = true')
      .groupBy('user.username')
      .orderBy('victories', 'DESC')
      .limit(10)
      .getRawMany();

    return raw.map(r => ({
      username: r.username,
      victories: parseInt(r.victories, 10),
    }));
  }


}
