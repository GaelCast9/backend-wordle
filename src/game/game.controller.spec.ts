import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { AuthGuard } from '@nestjs/passport';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  const mockGameService = {
    checkGuess: jest.fn().mockImplementation((userId, dto) => ({
      result: [
        { letter: 'A', value: 1 },
        { letter: 'B', value: 2 },
        { letter: 'C', value: 3 },
        { letter: 'D', value: 3 },
        { letter: 'E', value: 3 },
      ],
      won: false,
    })),
    assignNextWord: jest.fn().mockResolvedValue({
      message: 'Nueva palabra asignada.',
      wordId: 42,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true }) // 🔐 Simula autenticación
      .compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
  });

  it('debe devolver feedback del intento', async () => {
    const dto = { guess: 'ABCDE' };
    const req = { user: { userId: 1 } };
    const response = await controller.checkGuess(dto, req);
    expect(response.result).toBeDefined();
    expect(service.checkGuess).toHaveBeenCalledWith(1, dto);
  });

  it('debe asignar nueva palabra', async () => {
    const req = { user: { userId: 2 } };
    const response = await controller.getNextWord(req);
    expect(response.message).toBe('Nueva palabra asignada.');
    expect(service.assignNextWord).toHaveBeenCalledWith(2);
  });
});
