import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserInfoDto } from './dto/user-info.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    uid: string,
    email: string,
    image: string | null,
  ): Promise<void> {
    try {
      if (!email) {
        throw new NotAcceptableException('이메일 입력이 없습니다.');
      }

      const user: User = {
        uid,
        email,
        image,
      };

      await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo(idToken: string): Promise<UserInfoDto> {
    try {
      const bearerIdToken: string = idToken.substring(7);
      const decodedIdToken: any = jwt.decode(bearerIdToken);

      const uid: string = decodedIdToken.uid;

      const user = await this.userRepository.find({
        select: {
          email: true,
          image: true,
        },
        where: {
          uid: uid,
        },
      });

      if (user.length === 0) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      const ret: UserInfoDto = {
        user_email: user[0].email,
        user_image: user[0].image,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
