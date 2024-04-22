import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { fetchConfig, loadConfig } from './app.config';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
