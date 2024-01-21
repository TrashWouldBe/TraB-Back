import { HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserInfoDto } from './dto/user-info.dto';
import { ImageService } from 'src/image/image.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { HttpServerError } from 'src/common/error/errorHandler';
import { userErrorCode } from 'src/common/error/errorCode';
import { decodeToken } from 'src/common/utils/decode-idtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly firebaseService: FirebaseService,
    private readonly imageService: ImageService,
  ) {}

  async getUserByUserId(uid: string) {
    try {
      const users: User[] = await this.userRepository.find({
        where: {
          uid: uid,
        },
      });

      if (users.length !== 1) {
        throw new NotFoundException('해당 플로깅을 찾을 수 업습니다.');
      }

      return users[0];
    } catch (error) {
      throw error;
    }
  }

  async createUser(uid: string, email: string, image: string | null): Promise<void> {
    try {
      if (!email) {
        throw new NotAcceptableException('이메일 입력이 없습니다.');
      }

      const user: User = {
        uid,
        email,
        image,
        deletedAt: null,
      };

      await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo(idToken: string): Promise<UserInfoDto> {
    try {
      const uid: string = await decodeToken(idToken);

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

  async getUserImage(idToken: string): Promise<string> {
    try {
      const uid: string = await decodeToken(idToken);

      const user = await this.userRepository.find({
        select: {
          image: true,
        },
        where: {
          uid: uid,
        },
      });

      if (user.length === 0) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      return user[0].image;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(idToken: string): Promise<void> {
    try {
      const uid: string = await decodeToken(idToken);

      const auth = this.firebaseService.getAuth();

      await auth.deleteUser(uid).catch((error) => {
        throw new HttpServerError(
          {
            code: userErrorCode.FAIL_DELETE_USER_IN_FIREBASE,
            message: '파이어베이스에서 지우는 과정에서 오류가 발생했습니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      });

      const result = await this.userRepository
        .createQueryBuilder()
        .softDelete()
        .where('uid = :uid', { uid: uid })
        .execute();

      if (result.affected === 0) {
        throw new NotAcceptableException('DB에서 지우는 과정에서 오류가 발생했습니다.');
      }
    } catch (error) {
      throw error;
    }
  }

  async changeUserImage(idToken: string, image: Express.Multer.File): Promise<string> {
    try {
      const uid: string = await decodeToken(idToken);

      const imageUrl: string = await this.imageService.uploadProfileImage(image, uid);

      const result = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ image: imageUrl })
        .where('uid = :uid', { uid: uid })
        .execute();

      if (result.affected === 0) {
        throw new NotAcceptableException('디비 저장과정에서 오류가 발생했습니다.');
      }

      return imageUrl;
    } catch (error) {
      throw error;
    }
  }
}
