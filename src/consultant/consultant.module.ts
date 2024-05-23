import { Module } from '@nestjs/common';
import { ConsultantController } from './consultant.controller';
import { ConsultantService } from './consultant.service';
import { ConsultantApiService } from '@/consultant';
import { RsaApiService } from '@/rsa-api';
import {UserService} from '../user/user.service';

@Module({
  controllers: [ConsultantController],
  providers: [ConsultantService, ConsultantApiService, RsaApiService, UserService],
})
export class ConsultantModule {}
