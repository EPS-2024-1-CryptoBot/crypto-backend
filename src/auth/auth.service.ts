import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private firebaseAdmin: FirebaseAdminService,
  ) { }

  async login(email: string, token: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verifyFirebaseToken = await this.firebaseAdmin.verifyToken(token);
    if (!verifyFirebaseToken) {
      throw new NotFoundException('Token not valid');
    }

    const requestToken = this.generateToken(user);

    return { token: requestToken, user };
  }

  async register(email: string, token: string, firstName: string, lastName: string, firebaseUid: string, public_key: string, private_key: string[]) {
    const verifyFirebaseToken = await this.firebaseAdmin.verifyToken(token);
    if (!verifyFirebaseToken) {
      throw new NotFoundException('Token not valid');
    }

    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new NotFoundException('User already exists');
    }

    // const firebaseUid = verifyFirebaseToken.uid;

    const user = await this.userService.createUser({
      email,
      firstName,
      lastName,
      firebaseUid,
      public_key,
      private_key
    });

    const requestToken = this.generateToken(user);

    return { token: requestToken, user };
  }

  generateToken(user: User): string {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }
}
