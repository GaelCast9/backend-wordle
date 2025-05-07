import { IsString, Length } from 'class-validator';

export class CreateWordDto {
  @IsString()
  @Length(5, 5, { message: 'La palabra debe tener exactamente 5 letras' })
  word: string;
}
