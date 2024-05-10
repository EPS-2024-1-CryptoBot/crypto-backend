import { Module } from '@nestjs/common';
import { RsaApiService } from './rsa-api.service';

@Module({
  providers: [RsaApiService],
  exports: [RsaApiService],
})
export class RsaApiModule {}
