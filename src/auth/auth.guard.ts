import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseAdminService } from 'src/auth/firebase-admin.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {}

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.firebaseAdminService.adminInstance.auth();

    try {
      const idToken = context
        .getArgs()[0]
        ?.headers?.authorization.split(' ')[1];
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
