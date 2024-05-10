import { Module } from '@nestjs/common';
import { WalletApiService } from './wallet-api.service';

@Module({
  providers: [WalletApiService],
  exports: [WalletApiService],
})
export class WalletApiModule {}
