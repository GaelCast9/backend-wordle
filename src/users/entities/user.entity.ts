import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserWord } from 'src/user-word/entities/user-word.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => UserWord, userWord => userWord.word)
  userWords: UserWord[];
}
