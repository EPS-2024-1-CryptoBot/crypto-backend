import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RsaApiService } from '@/rsa-api';

@Module({
  controllers: [UserController],
  providers: [UserService, RsaApiService],
  exports: [UserService],
})
export class UserModule {}
