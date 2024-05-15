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
  ],
  controllers: [AppController],
  providers: [FirebaseAdminService],
})
export class AppModule {}
