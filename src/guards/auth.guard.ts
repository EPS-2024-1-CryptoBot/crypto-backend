import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import admin from 'firebase-admin';
import { appConfig } from 'src/app.config';
import { FirebaseAdminService } from 'src/auth/firebase-admin.service';

const serviceAccount = appConfig.google.firebase_service_account;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.firebaseAdminService.adminInstance.auth();
    const idToken = context.getArgs()[0]?.headers?.authorization.split(' ')[1];
    console.log(context.getArgs()[0]?.headers?.authorization);
    try {
      return await app
        .verifyIdToken(idToken)
        .then(async (decodedToken) => {
          const user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
          };
          context.getArgs()[0].user = user;
          return true;
        })
        .catch((error) => {
          console.log('Error', error);
          throw new UnauthorizedException();
        });
    } catch (error) {
      console.log('Error', error);
      throw new UnauthorizedException();
    }
  }
}
