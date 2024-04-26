import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @Auth()
  getProfile(@Req() req: Request) {
    const user = (req as any).user; // Acesse o usuário a partir do contexto da requisição
    console.log(user); // Exibe o usuário no console
    return { success: true, data: { user: user } };
  }
}
