import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { fetchConfig } from 'src/app.config';
import { JwtStrategy } from './jwt.strategy';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  providers: [AuthService, FirebaseAdminService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: fetchConfig('app', 'jwt_secret'),
      signOptions: { expiresIn: '2 days' },
    }),
  ],
})
export class AuthModule {}
