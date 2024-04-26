import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import admin from 'firebase-admin';
import { appConfig } from 'src/app.config';
import { UserDto } from 'src/user/dto/user.dto';

// Read the JSON file
const serviceAccount = appConfig.google.firebase_service_account;

@Injectable()
export class FirebaseAdminService {
  public readonly adminInstance: admin.app.App;

  private readonly _logger = new Logger(FirebaseAdminService.name);

  private initialized = false;

  constructor() {
    if (!admin.apps.length) {
      this.adminInstance = admin.initializeApp(
        {
          credential: admin.credential.cert(serviceAccount),
        },
        'CryptoBotWebApp',
      );
      this.initialized = true;
    } else {
      this.adminInstance = admin.app('CryptoBotWebApp');
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public async resetPassword(uid: string, password: string): Promise<any> {
    try {
      await this.adminInstance.auth().updateUser(uid, {
        password,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // public async createUser(
  //   email: string,
  //   password: string,
  //   emailVerified: boolean,
  // ): Promise<any> {
  //   try {
  //     return await this.adminInstance
  //       .auth()
  //       .createUser({ emailVerified, email, password });
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  public async verifyToken(token: string): Promise<any> {
    try {
      await this.adminInstance.auth().verifyIdToken(token);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async deleteUser(uid: string): Promise<any> {
    try {
      await this.adminInstance.auth().deleteUser(uid);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async updateEmail(uid: string, newEmail: string): Promise<boolean> {
    try {
      const user = await this.adminInstance
        .auth()
        .getUserByEmail(newEmail)
        .then((userRecord) => userRecord.toJSON())
        .catch(() => false);
      if (user) {
        return false;
      }
      await this.adminInstance.auth().updateUser(uid, {
        email: newEmail,
      });
      return true;
    } catch (error) {
      this._logger.error(error);
      return false;
    }
  }

  async createUser(userRequest: UserDto): Promise<any> {
    const { email, password, firstName, lastName, role } = userRequest;
    const app = this.adminInstance;

    try {
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      await app.auth().setCustomUserClaims(createdUser.uid, { role });
      return createdUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
