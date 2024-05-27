import { Test, TestingModule } from '@nestjs/testing';
import { RsaApiService } from '@/rsa-api';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto, RegisterDto } from 'src/auth/dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from 'src/database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { FirebaseAdminService } from 'src/auth/firebase-admin.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let rsaApiService: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UserService,
        AuthService,
        RsaApiService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        JwtService,
        FirebaseAdminService,
        {
          provide: FirebaseAdminService,
          useValue: {
            verifyIdToken: jest.fn(),
            adminInstance: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    rsaApiService = module.get<RsaApiService>(RsaApiService);
  });

  describe('login', () => {
    it('should call authService.login with the correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        token: 'token',
      };

      const loginSpy = jest.spyOn(authService, 'login').mockResolvedValue({
        token: 'token',
      } as any);

      await controller.login(loginDto);

      expect(loginSpy).toHaveBeenCalledWith(loginDto.email, loginDto.token);
    });
  });

  describe('register', () => {
    it('should call authService.register with the correct parameters', async () => {
      const registerDto: RegisterDto = {
        email: 'john@example.com',
        token: 'token',
        firstName: 'John',
        lastName: 'Doe',
        firebaseUid: 'firebaseUid',
      };

      const keys = {
        data: {
          public_key: 'public_key',
          private_encrypted_key: 'private_encrypted_key',
        },
      };

      jest.spyOn(rsaApiService, 'getKeys').mockResolvedValue(keys as any);
      const registerSpy = jest
        .spyOn(authService, 'register')
        .mockResolvedValue({} as any);

      await controller.register(registerDto);

      expect(rsaApiService.getKeys).toHaveBeenCalled();
      expect(registerSpy).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.token,
        registerDto.firstName,
        registerDto.lastName,
        registerDto.firebaseUid,
        keys.data.public_key,
        keys.data.private_encrypted_key,
      );
    });
  });
});
