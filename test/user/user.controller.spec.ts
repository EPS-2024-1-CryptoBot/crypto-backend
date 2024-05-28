import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/database/entities';
import { Request, Response } from 'express';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/user.dto';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getProfile', () => {
    it('should return the user profile', () => {
      const req = { user: { id: '1', name: 'John Doe' } } as unknown as Request;
      const expectedResult = { success: true, data: { user: req.user } };

      const result = controller.getProfile(req);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUsers', () => {
    it('should return all users', () => {
      const users = [{ id: '1', name: 'John Doe' }] as unknown as User[];
      jest.spyOn(userService, 'findAll').mockReturnValue(users as any);

      const result = controller.getUsers();

      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return the user with the specified id', () => {
      const user = { id: '1', name: 'John Doe' } as unknown as User;
      jest.spyOn(userService, 'findById').mockReturnValue(user as any);

      const result = controller.getUserById('1');

      expect(result).toEqual(user);
    });
  });

  describe('getUserByFirebaseUid', () => {
    it('should return the user with the specified firebaseUid', async () => {
      const user = { id: '1', name: 'John Doe' } as unknown as User;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      jest.spyOn(userService, 'findByFirebaseUid').mockResolvedValue(user);

      await controller.getUserByFirebaseUid('firebaseUid', res);

      expect(userService.findByFirebaseUid).toHaveBeenCalledWith('firebaseUid');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return a 404 error if the user is not found', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      jest
        .spyOn(userService, 'findByFirebaseUid')
        .mockRejectedValue(new Error('User not found'));

      await controller.getUserByFirebaseUid('firebaseUid', res);

      expect(userService.findByFirebaseUid).toHaveBeenCalledWith('firebaseUid');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const createUserDto = { name: 'John Doe' } as unknown as CreateUserDto;
      const createdUser = { id: '1', name: 'John Doe' } as unknown as User;
      jest.spyOn(userService, 'createUser').mockReturnValue(createdUser as any);

      const result = controller.createUser(createUserDto);

      expect(result).toEqual(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should update the user with the specified id', () => {
      const updateUserDto = { name: 'John Doe' } as unknown as UpdateUserDto;
      const updatedUser = { id: '1', name: 'John Doe' } as unknown as User;
      jest.spyOn(userService, 'updateUser').mockReturnValue(updatedUser as any);

      const result = controller.updateUser('1', updateUserDto);

      expect(result).toEqual(updatedUser);
    });
  });
});
