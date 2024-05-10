import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/auth.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities';
import { RsaApiService } from '@/rsa-api';

@Controller('users')
@ApiTags('users')
export class UserController {
  
  constructor(
    private readonly userService: UserService, 
    private readonly rsaApiService:  RsaApiService
  ) {}

  // This is just to test Auth decorator
  @Get('/profile')
  @Auth()
  getProfile(@Req() req: Request) {
    const user = (req as any).user;
    console.log(user);
    return { success: true, data: { user: user } };
  }

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    const keys = await this.rsaApiService.getKeys();
    user.public_key = keys.data.public_key;
    user.private_key = keys.data.private_encrypted_key;
    return this.userService.createUser(user as User);
  }

  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user as User);
  }
}
