import { IsString, Length } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @Length(5, 5, { message: 'La palabra debe tener exactamente 5 letras' })
  guess: string;
}
