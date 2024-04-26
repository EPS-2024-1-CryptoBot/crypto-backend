import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { fetchConfig, loadConfig } from './app.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FirebaseAdminService } from './auth/firebase-admin.service';

const AppConfig = ConfigModule.forRoot({
  isGlobal: true,
  load: [loadConfig],
});

@Module({
  imports: [
    AppConfig,
    MongooseModule.forRoot(fetchConfig('db', 'urlString'), {
      dbName: fetchConfig('db', 'dbName'),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAdminService],
})
export class AppModule {}
