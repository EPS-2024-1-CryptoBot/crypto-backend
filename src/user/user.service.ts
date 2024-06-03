import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(payload: DeepPartial<User>): Promise<User> {
    return await this.userRepository.save(payload);
  }

  async updateUser(id: string, payload: User): Promise<User> {
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(payload)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  async updateUserByFirebaseUid(firebaseUid: string, payload: { api_token_binance: string }): Promise<User> {
    try{
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ api_token_binance: payload.api_token_binance })
      .where('firebaseUid = :firebaseUid', { firebaseUid })
      .returning('*')
      .execute();
    console.log("RESPONSEEE 2", firebaseUid, result)
    return result.raw[0];
  } catch (error) {
    throw new Error(error.message || 'An error occurred while searching for the user');
  }
}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async findByFirebaseUid(firebaseUid: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { firebaseUid } });
      if (!user) {
        throw new Error(`User with Hash ${firebaseUid} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(error.message || 'An error occurred while searching for the user');
    }
  }
  
}
