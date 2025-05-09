import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserWord } from 'src/user-word/entities/user-word.entity';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserWord, { eager: true })
  userWord: UserWord;

  @Column()
  guess: string;

  @CreateDateColumn()
  createdAt: Date;
}
