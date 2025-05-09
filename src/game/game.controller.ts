import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('guess')
  checkGuess(@Body() dto: CreateGameDto, @Request() req) {
    return this.gameService.checkGuess(req.user.userId, dto);
  }

  @Get('next')
  getNextWord(@Request() req) {
    return this.gameService.assignNextWord(req.user.userId);
  }
}
