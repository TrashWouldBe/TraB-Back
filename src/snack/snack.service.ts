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

  async earnSnack(uid: string, trashType: string): Promise<Snack> {
    try {
      const userSnack: Snack = await this.getSnackByUid(uid);

      if (userSnack[trashType] !== undefined) {
        userSnack[trashType] = (userSnack[trashType] as number) + 1;
      } else {
        throw new NotAcceptableException('유효하지 않은 trashType 입니다.');
      }

      await this.snackRepository.save(userSnack);

      return userSnack;
    } catch (error) {
      throw Error('간식 개수 저장과정에서 오류 발생');
    }
  }

  async earnSnacks(uid: string, trashMap: Map<string, number>): Promise<void> {
    try {
      const userSnack: Snack = await this.getSnackByUid(uid);

      userSnack['glass'] = (userSnack['glass'] as number) + trashMap.get('glass');
      userSnack['paper'] = (userSnack['paper'] as number) + trashMap.get('paper');
      userSnack['can'] = (userSnack['can'] as number) + trashMap.get('can');
      userSnack['plastic'] = (userSnack['plastic'] as number) + trashMap.get('plastic');
      userSnack['vinyl'] = (userSnack['vinyl'] as number) + trashMap.get('vinyl');
      userSnack['styrofoam'] = (userSnack['styrofoam'] as number) + trashMap.get('styrofoam');
      userSnack['general_waste'] = (userSnack['general_waste'] as number) + trashMap.get('general_waste');
      userSnack['food_waste'] = (userSnack['food_waste'] as number) + trashMap.get('food_waste');

      await this.snackRepository.save(userSnack);
    } catch (error) {
      throw Error('간식 개수 저장과정에서 오류 발생');
    }
  }
}
