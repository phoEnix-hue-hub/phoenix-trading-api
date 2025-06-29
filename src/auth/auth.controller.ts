import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto'; // Ensure this file exists

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Register attempt:', createUserDto);
    return { success: true, message: 'Registration initiated', user: createUserDto };
  }
}
