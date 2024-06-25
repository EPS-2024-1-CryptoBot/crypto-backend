import { RsaApiService } from '@/rsa-api';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly rsaApiService: RsaApiService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.token);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const keys = await this.rsaApiService.getKeys();

    return this.authService.register(
      registerDto.email,
      registerDto.token,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.firebaseUid,
      keys.data.public_key,
      keys.data.private_encrypted_key,
    );
  }
}
