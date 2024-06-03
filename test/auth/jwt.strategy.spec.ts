import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { UserService } from '../../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/database/entities';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user when a valid payload is provided', async () => {
      const payload = { sub: 'user-id' };
      const user = { id: 'user-id', name: 'John Doe' };

      jest.spyOn(userService, 'findById').mockResolvedValue(user as any);

      const result = await strategy.validate(payload);

      expect(result).toEqual(user);
      expect(userService.findById).toHaveBeenCalledWith(payload.sub);
    });

    it('should throw an UnauthorizedException when the user is not found', async () => {
      const payload = { sub: 'non-existing-user' };

      jest.spyOn(userService, 'findById').mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findById).toHaveBeenCalledWith(payload.sub);
    });
  });
});
