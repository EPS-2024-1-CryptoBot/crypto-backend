import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(payload: User): Promise<User> {
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

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
