import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RsaApiService } from '@/rsa-api';
import { ConsultantService } from 'src/consultant/consultant.service';
import { ConsultantApiService } from '@/consultant';


@Module({
  controllers: [UserController],
  providers: [UserService, RsaApiService, ConsultantService, ConsultantApiService],
  exports: [UserService],
})
export class UserModule {}
