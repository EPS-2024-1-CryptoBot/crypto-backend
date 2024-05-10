import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletApiService } from '@/wallet-api';

@Module({
  controllers: [WalletController],
  providers: [WalletService, WalletApiService],
})
export class WalletModule {}
