import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; phone: string; email: string; password: string }) {
    const { name, phone, email, password } = body;
    return this.authService.register(name, phone, email, password);
  }

  @Post('login')
  async login(@Body() body: { identifier: string; password: string }) {
    const { identifier, password } = body;
    return this.authService.login(identifier, password);
  }
}
