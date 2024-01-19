import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Snack } from './entities/snack.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SnackService {
  constructor(
    @InjectRepository(Snack)
    private readonly snackRepository: Repository<Snack>,
  ) {}

  async getSnackByUid(uid: string): Promise<Snack> {
    try {
      const snack = await this.snackRepository.find({
        relations: {
          trab: {
            user: true,
          },
        },
        where: {
          trab: {
            user: {
              uid: uid,
            },
          },
        },
      });

      if (snack.length !== 1) {
        throw new NotFoundException('snack entity를 찾는 과정에서 오류가 발생했습니다.');
      }

      return snack[0];
    } catch (error) {
      throw error;
    }
  }

  async earnSnack(uid: string, trashType: string): Promise<void> {
    try {
      const userSnack: Snack = await this.getSnackByUid(uid);

      if (userSnack[trashType] !== undefined) {
        userSnack[trashType] = (userSnack[trashType] as number) + 1;
      } else {
        throw new NotAcceptableException('유효하지 않은 trashType 입니다.');
      }

      await this.snackRepository.save(userSnack);
    } catch (error) {
      throw Error('여기서 오류 발생');
    }
  }
}
