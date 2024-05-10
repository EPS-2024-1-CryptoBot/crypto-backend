import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { FirebaseAdminService } from './firebase-admin.service';
import { RsaApiService } from 'libs/rsa-api/src/rsa-api.service'

@Injectable()
export class AuthService {

  private readonly rsaApiService:  RsaApiService;

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

  async register(email: string, token: string, firstName: string, lastName: string, firebaseUid: string) {
    const verifyFirebaseToken = await this.firebaseAdmin.verifyToken(token);
    if (!verifyFirebaseToken) {
      throw new NotFoundException('Token not valid');
    }

    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new NotFoundException('User already exists');
    }

    // const firebaseUid = verifyFirebaseToken.uid;
    
    const keys = await this.rsaApiService.getKeys();
    console.log(keys);
    const public_key = keys.data.public_key;
    const private_key = keys.data.private_key;

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
