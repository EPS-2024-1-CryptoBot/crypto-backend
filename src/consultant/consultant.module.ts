import { ConsultantApiService } from '@/consultant';
import { RsaApiService } from '@/rsa-api';
import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConsultantController } from './consultant.controller';
import { ConsultantService } from './consultant.service';

@Module({
  controllers: [ConsultantController],
  providers: [
    ConsultantService,
    ConsultantApiService,
    RsaApiService,
    UserService,
  ],
})
export class ConsultantModule {}
