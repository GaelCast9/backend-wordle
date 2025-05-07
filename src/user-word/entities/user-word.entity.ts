import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Word } from 'src/words/entities/word.entity';


@Entity()
export class UserWord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userWords, { eager: true })
  user: User;

  @ManyToOne(() => Word, word => word.userWords, { eager: true })
  word: Word;

  @CreateDateColumn()
  createdAt: Date;
}
