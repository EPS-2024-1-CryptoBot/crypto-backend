import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing/test';
import { AuthService } from 'src/auth/auth.service';

import { FirebaseAdminService } from 'src/auth/firebase-admin.service';
import { UserService } from 'src/user/user.service';

import { NotFoundException } from '@nestjs/common';
import { User } from 'src/database/entities';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let firebaseAdmin: FirebaseAdminService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: FirebaseAdminService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    firebaseAdmin = module.get<FirebaseAdminService>(FirebaseAdminService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('login', () => {
    it('should return user and token', async () => {
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        firebaseUid: 'firebaseUid',
        public_key: 'public_key',
        private_key: ['private_key'],
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user as any);
      jest.spyOn(firebaseAdmin, 'verifyToken').mockResolvedValue(true);
      jest
        .spyOn(authService, 'generateToken')
        .mockReturnValue('generatedToken');

      const result = await authService.login(user.email, 'token');

      expect(userService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(firebaseAdmin.verifyToken).toHaveBeenCalledWith('token');
      expect(authService.generateToken).toHaveBeenCalledWith(user);
      expect(result).toEqual({ token: 'generatedToken', user });
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(undefined);

      await expect(
        authService.login('nonexistent@example.com', 'token'),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw NotFoundException if token is not valid', async () => {
      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValue(undefined as User | Promise<User>);
      jest.spyOn(firebaseAdmin, 'verifyToken').mockResolvedValue(false);

      await expect(
        authService.login('john@example.com', 'invalidToken'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('register', () => {
    it('should return user and token', async () => {
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        firebaseUid: 'firebaseUid',
        public_key: 'public_key',
        private_key: ['private_key'],
      };

      jest.spyOn(firebaseAdmin, 'verifyToken').mockResolvedValue(true);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(undefined);
      jest.spyOn(userService, 'createUser').mockResolvedValue(user as any);
      jest
        .spyOn(authService, 'generateToken')
        .mockReturnValue('generatedToken');

      const result = await authService.register(
        user.email,
        'token',
        user.firstName,
        user.lastName,
        user.firebaseUid,
        user.public_key,
        user.private_key,
      );

      expect(firebaseAdmin.verifyToken).toHaveBeenCalledWith('token');
      expect(userService.findByEmail).toHaveBeenCalledWith(user.email);
      expect(userService.createUser).toHaveBeenCalledWith({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        firebaseUid: user.firebaseUid,
        public_key: user.public_key,
        private_key: user.private_key,
      });
      expect(authService.generateToken).toHaveBeenCalledWith(user);
      expect(result).toEqual({ token: 'generatedToken', user });
    });

    it('should throw NotFoundException if token is not valid', async () => {
      jest.spyOn(firebaseAdmin, 'verifyToken').mockResolvedValue(false);

      await expect(
        authService.register(
          'john@example.com',
          'invalidToken',
          'John',
          'Doe',
          'firebaseUid',
          'public_key',
          ['private_key'],
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw NotFoundException if user already exists', async () => {
      jest.spyOn(firebaseAdmin, 'verifyToken').mockResolvedValue(true);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue({} as any);

      await expect(
        authService.register(
          'existing@example.com',
          'token',
          'John',
          'Doe',
          'firebaseUid',
          'public_key',
          ['private_key'],
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  // ...
});
