import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: CreateUserDto) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) throw new Error('Credenciales incorrectas');
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
