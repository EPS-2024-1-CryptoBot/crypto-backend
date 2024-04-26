import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/hello')
  getHello(@Req() request: Request): string {
    console.log('User', JSON.stringify(request['user']));
    return 'Hello ' + JSON.stringify(request['user']) + '!';
  }
}
