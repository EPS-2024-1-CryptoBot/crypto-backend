import { ConsultantApiService } from '@/consultant';
import { RsaApiService } from '@/rsa-api';
import { Module } from '@nestjs/common';
import { ConsultantService } from 'src/consultant/consultant.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    RsaApiService,
    ConsultantService,
    ConsultantApiService,
  ],
  exports: [UserService],
})
export class UserModule {}
