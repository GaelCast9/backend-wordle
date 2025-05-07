import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserWord } from 'src/user-word/entities/user-word.entity';


@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  word: string;

  @OneToMany(() => UserWord, userWord => userWord.word)
  userWords: UserWord[];
}
