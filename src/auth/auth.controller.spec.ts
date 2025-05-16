import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('debe iniciar sesión correctamente con credenciales válidas', async () => {
    const dto: CreateUserDto = { username: 'admin', password: '12345' };
    const fakeUser = { id: 1, username: 'admin' };
    const fakeToken = { access_token: 'token123' };

    mockAuthService.validateUser.mockResolvedValue(fakeUser);
    mockAuthService.login.mockResolvedValue(fakeToken);

    const result = await controller.login(dto);
    expect(result).toEqual(fakeToken);
    expect(service.validateUser).toHaveBeenCalledWith('admin', '12345');
    expect(service.login).toHaveBeenCalledWith(fakeUser);
  });

  it('debe lanzar UnauthorizedException con credenciales inválidas', async () => {
    const dto: CreateUserDto = { username: 'wrong', password: 'bad' };
    mockAuthService.validateUser.mockResolvedValue(null);

    await expect(controller.login(dto)).rejects.toThrow('Credenciales incorrectas');
  });

  it('debe registrar un nuevo usuario', async () => {
    const dto: CreateUserDto = { username: 'newuser', password: 'secret' };
    const result = { access_token: 'token123' };

    mockAuthService.register.mockResolvedValue(result);

    const res = await controller.register(dto);
    expect(res).toEqual(result);
    expect(service.register).toHaveBeenCalledWith(dto);
  });
});
