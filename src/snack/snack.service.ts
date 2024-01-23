import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Snack } from './entities/snack.entity';
import { Repository } from 'typeorm';
import { SnackDto } from './dto/snack.dto';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { Trab } from 'src/trab/entities/trab.entity';
import { Trash_image } from 'src/image/entities/trash_image.entity';

@Injectable()
export class SnackService {
  constructor(
    @InjectRepository(Snack)
    private readonly snackRepository: Repository<Snack>,
    @InjectRepository(Trash_image)
    private readonly trashImageRepository: Repository<Trash_image>,
  ) {}

  async getSnackByUserId(uid: string): Promise<Snack> {
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

  async getSnackByTrabId(trabId: number): Promise<Snack> {
    try {
      const snack: Snack[] = await this.snackRepository.find({
        select: {
          trab: {
            trab_id: true,
          },
        },
        where: {
          trab: {
            trab_id: trabId,
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

  async getSnackPhotos(trabId: number): Promise<{ imageUrl: string; type: string }[]> {
    try {
      const snackid = await this.snackRepository.findOne({ 
        where: { 
          trab:{
            trab_id: trabId
    }}});

      if(!snackid){
        throw new NotFoundException('해당 id가 읎는디요?\n');
      }
      const snackData = await this.trashImageRepository.find({
        where:{
          snack:{
            snack_id: snackid.snack_id,
          }
        }
      })

      const photoesAndTypes = snackData.map(trash=>({
        imageUrl: trash.image,
        type: trash.trash_tag
      }))

      if(snackData.length === 0){
        throw new NotFoundException('모은 쓰레기가 없는디요?\n');
      }
      return photoesAndTypes;
    } catch (error) {
      throw error;
    }
  }

  async createSnack(trab: Trab): Promise<void> {
    try {
      await this.snackRepository
        .createQueryBuilder()
        .insert()
        .into(Snack)
        .values([
          {
            trab: trab,
          },
        ])
        .execute();
    } catch (error) {
      throw error;
    }
  }

  async getSnack(trabId: number): Promise<SnackDto> {
    try {
      const userSnack = await this.getSnackByTrabId(trabId);

      const ret: SnackDto = {
        glass: userSnack.glass,
        paper: userSnack.paper,
        can: userSnack.can,
        plastic: userSnack.plastic,
        vinyl: userSnack.vinyl,
        styrofoam: userSnack.styrofoam,
        general_waste: userSnack.general_waste,
        food_waste: userSnack.food_waste,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async earnSnack(uid: string, trashType: string): Promise<Snack> {
    try {
      const userSnack: Snack = await this.getSnackByUserId(uid);

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
      const userSnack: Snack = await this.getSnackByUserId(uid);

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
