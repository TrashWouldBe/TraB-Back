import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(email: string): Promise<void> {
    try {
      if (!email) {
        throw new NotAcceptableException('이메일 입력이 없습니다.');
      }

      const user: User = new User();
      user.email = email;

      await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }
}
