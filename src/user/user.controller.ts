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
import { Auth } from 'src/auth/auth.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities';
import { Request, Response } from 'express';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('/destination/:firebaseUid')
  async getUserByFirebaseUid(
    @Param('firebaseUid') firebaseUid: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.findByFirebaseUid(firebaseUid);
      console.log('user', user);
      return res.status(200).json(user);
    } catch (error) {
      console.log('error11', error);
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
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user as User);
  }
}
