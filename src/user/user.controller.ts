import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConsultantService } from 'src/consultant/consultant.service';
import { Auth } from 'src/auth/auth.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities';
import { Request, Response } from 'express';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly consultantService: ConsultantService,
  ) {}

  // This is just to test Auth decorator
  @Get('/profile')
  @Auth()
  getProfile(@Req() req: Request) {
    const user = (req as any).user;
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

  @Get('/destination/:firebaseUid')
  async getUserByFirebaseUid(
    @Param('firebaseUid') firebaseUid: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.findByFirebaseUid(firebaseUid);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({
        message:
          error.message || 'An error occurred while searching for the user',
      });
    }
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user as User);
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    const api_token_binance =
      await this.consultantService.addApiKeyBinanceToUser(
        user.api_token_binance,
      );
    const binance_api_secret =
      await this.consultantService.addApiKeyBinanceToUser(
        user.binance_api_secret,
      );
    const new_user = { ...user, api_token_binance, binance_api_secret };
    return this.userService.updateUser(id, new_user as User);
  }
}
