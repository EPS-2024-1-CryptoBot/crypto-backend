import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { User } from 'src/database/entities/user.entity';
import { UserService } from 'src/user/user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const payload: DeepPartial<User> = {
        /* provide the payload for the test */
      };
      const savedUser = {
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(repository, 'save').mockResolvedValueOnce(savedUser as any);

      const result = await service.createUser(payload);

      expect(repository.save).toHaveBeenCalledWith(payload);
      expect(result).toEqual(savedUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const id = 'user-id';
      const payload = {
        firstName: 'Jane',
        lastName: 'Doe',
      };
      const updatedUser = {
        id,
        ...payload,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({ raw: [updatedUser] }),
      } as any);

      const result = await service.updateUser(id, payload as any);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
  });

  describe('updateUserByFirebaseUid', () => {
    it('should update a user by Firebase UID', async () => {
      const firebaseUid = 'firebase-uid';
      const payload = {
        api_token_binance: 'api-token',
      };
      const updatedUser = {
        id: 'user-id',
        firebaseUid,
        ...payload,
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({ raw: [updatedUser] }),
      } as any);

      const result = await service.updateUserByFirebaseUid(
        firebaseUid,
        payload,
      );

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if user is not found 1', async () => {
      const firebaseUid = 'non-existing-uid';
      const payload = {
        api_token_binance: 'api-token',
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({ raw: [] }),
      } as any);
      const result = await service.updateUserByFirebaseUid(
        firebaseUid,
        payload,
      );
      expect(result).toBeUndefined();
    });

    it('should throw an error if an error occurs while searching for the user', async () => {
      const firebaseUid = 'firebase-uid';
      const payload = {
        api_token_binance: 'api-token',
      };
      const errorMessage = 'An error occurred while searching for the user';

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      } as any);

      await expect(
        service.updateUserByFirebaseUid(firebaseUid, payload),
      ).rejects.toThrowError(errorMessage);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        {
          id: 'user-id-1',
          firstName: 'John',
          lastName: 'Doe',
        } as any,
        {
          id: 'user-id-2',
          firstName: 'Jane',
          lastName: 'Smith',
        } as any,
      ];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(users);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const id = 'user-id';
      const user = {
        id,
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user as any);

      const result = await service.findById(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john.doe@example.com';
      const user = {
        id: 'user-id',
        firstName: 'John',
        lastName: 'Doe',
        email,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user as any);

      const result = await service.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(user);
    });
  });

  describe('findByFirebaseUid', () => {
    it('should return a user by Firebase UID', async () => {
      const firebaseUid = 'firebase-uid';
      const user = {
        id: 'user-id',
        firstName: 'John',
        lastName: 'Doe',
        firebaseUid,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user as any);

      const result = await service.findByFirebaseUid(firebaseUid);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { firebaseUid },
      });
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      const firebaseUid = 'non-existing-uid';

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findByFirebaseUid(firebaseUid)).rejects.toThrowError(
        `User with Hash ${firebaseUid} not found`,
      );
    });

    it('should throw an error if an error occurs while searching for the user', async () => {
      const firebaseUid = 'firebase-uid';
      const errorMessage = 'An error occurred while searching for the user';

      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(service.findByFirebaseUid(firebaseUid)).rejects.toThrowError(
        errorMessage,
      );
    });
  });
});
