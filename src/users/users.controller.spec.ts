import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getStats: jest.fn().mockResolvedValue({ totalGames: 3, totalVictories: 2 }),
    getTop10: jest.fn().mockResolvedValue([
      { username: 'user1', victories: 5 },
      { username: 'user2', victories: 4 },
    ]),
    findOne: jest.fn().mockResolvedValue({ id: 1, username: 'testUser' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe devolver estadísticas del usuario', async () => {
    const req = { user: { userId: 1 } };
    const result = await controller.getStats(req);
    expect(result).toEqual({ totalGames: 3, totalVictories: 2 });
    expect(service.getStats).toHaveBeenCalledWith(1);
  });

  it('debe devolver el ranking top 10', async () => {
    const result = await controller.getTop10();
    expect(result).toHaveLength(2);
    expect(result[0].username).toBe('user1');
  });

  it('debe devolver un usuario por id', async () => {
    const result = await controller.findOne('1', { user: { userId: 1 } });
    expect(result).toEqual({ id: 1, username: 'testUser' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });
});
