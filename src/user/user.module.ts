import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FirebaseAdminService } from 'src/auth/firebase-admin.service';

@Module({
  controllers: [UserController],
  providers: [UserService, FirebaseAdminService],
})
export class UserModule {}
