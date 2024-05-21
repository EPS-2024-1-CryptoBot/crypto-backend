import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { loadConfig } from './app.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FirebaseAdminService } from './auth/firebase-admin.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { WalletApiModule } from '@/wallet-api';
import { ConsultantApiModule } from '@/consultant';
import { RsaApiModule } from '@/rsa-api';
import { ConsultantModule } from './consultant/consultant.module';

const AppConfig = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});

@Module({
  imports: [
    AppConfig,
    UserModule,
    DatabaseModule,
    AuthModule,
    WalletModule,
    WalletApiModule,
    RsaApiModule,
    ConsultantModule,
    ConsultantApiModule,
  ],
  controllers: [AppController],
  providers: [FirebaseAdminService],
})
export class AppModule {}
