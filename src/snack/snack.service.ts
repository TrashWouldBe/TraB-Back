import { Inject, Injectable, NotAcceptableException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Snack } from './entities/snack.entity';
import { Repository } from 'typeorm';
import { ReturnSnackDto } from './dto/return-snack.dto';
import { Trab } from 'src/trab/entities/trab.entity';
import { ReturnSnackImageInfoDto } from './dto/return-snack-image-info.dto';
import { ImageService } from 'src/image/image.service';
import { Trash_image } from 'src/image/entities/trash_image.entity';
import { GetFurnitureDto } from 'src/furniture/dto/get-furniture.dto';

@Injectable()
export class SnackService {
  constructor(
    @InjectRepository(Snack)
    private readonly snackRepository: Repository<Snack>,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
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

  async getSnackImages(trabId: number): Promise<ReturnSnackImageInfoDto[]> {
    try {
      const userSnack = await this.getSnackByTrabId(trabId);

      const snackTrashImages: Trash_image[] = await this.imageService.getTrashImagesBySnackId(userSnack.snack_id);

      const ret: ReturnSnackImageInfoDto[] = snackTrashImages.map((trash) => ({
        imageUrl: trash.image,
        trashType: trash.trash_tag,
      }));

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getSnackTotalImages(trabId: number): Promise<ReturnSnackImageInfoDto[]> {
    try {
      const userSnack = await this.getSnackByTrabId(trabId);

      const snackTrashImages: Trash_image[] = await this.imageService.getTotalTrashImagesBySnackId(userSnack.snack_id);

      const ret: ReturnSnackImageInfoDto[] = snackTrashImages.map((trash) => ({
        imageUrl: trash.image,
        trashType: trash.trash_tag,
      }));

      return ret;
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

  async getSnack(trabId: number): Promise<ReturnSnackDto> {
    try {
      const userSnack = await this.getSnackByTrabId(trabId);

      const ret: ReturnSnackDto = {
        glass: userSnack.glass,
        paper: userSnack.paper,
        metal: userSnack.metal,
        plastic: userSnack.plastic,
        vinyl: userSnack.vinyl,
        styrofoam: userSnack.styrofoam,
        general: userSnack.general,
        food: userSnack.food,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getTotalSnack(trabId: number): Promise<ReturnSnackDto> {
    try {
      const userSnack = await this.getSnackByTrabId(trabId);

      const usedTrash: number[] = await this.imageService.getUsedTrash(trabId);

      const ret: ReturnSnackDto = {
        glass: userSnack.glass + usedTrash[0],
        paper: userSnack.paper + usedTrash[1],
        metal: userSnack.metal + usedTrash[2],
        plastic: userSnack.plastic + usedTrash[3],
        vinyl: userSnack.vinyl + usedTrash[4],
        styrofoam: userSnack.styrofoam + usedTrash[5],
        general: userSnack.general + usedTrash[6],
        food: userSnack.food + usedTrash[7],
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
      userSnack['metal'] = (userSnack['metal'] as number) + trashMap.get('metal');
      userSnack['plastic'] = (userSnack['plastic'] as number) + trashMap.get('plastic');
      userSnack['vinyl'] = (userSnack['vinyl'] as number) + trashMap.get('vinyl');
      userSnack['styrofoam'] = (userSnack['styrofoam'] as number) + trashMap.get('styrofoam');
      userSnack['general'] = (userSnack['general'] as number) + trashMap.get('general');
      userSnack['food'] = (userSnack['food'] as number) + trashMap.get('food');

      await this.snackRepository.save(userSnack);
    } catch (error) {
      throw Error('간식 개수 저장과정에서 오류 발생');
    }
  }

  async useSnack(trabId: number, getFurnitureDto: GetFurnitureDto): Promise<void> {
    try {
      // 1
      const userSnack: Snack = await this.getSnackByTrabId(trabId);

      // // 2
      // const furnitures = Object.values(FURNITURE_LIST);
      // const targetFurniture = furnitures.find((furniture) => furniture.furnitureName === furnitureName);

      // 3
      if (
        userSnack.glass < getFurnitureDto.glass ||
        userSnack.paper < getFurnitureDto.paper ||
        userSnack.metal < getFurnitureDto.metal ||
        userSnack.plastic < getFurnitureDto.plastic ||
        userSnack.vinyl < getFurnitureDto.vinyl ||
        userSnack.styrofoam < getFurnitureDto.styrofoam ||
        userSnack.general < getFurnitureDto.general ||
        userSnack.food < getFurnitureDto.food
      ) {
        throw new NotAcceptableException('가지고 있는 간식 개수가 부족합니다.');
      }

      // 4
      const result = await this.snackRepository
        .createQueryBuilder()
        .update(Snack)
        .set({
          glass: userSnack.glass - getFurnitureDto.glass,
          paper: userSnack.paper - getFurnitureDto.paper,
          metal: userSnack.metal - getFurnitureDto.metal,
          plastic: userSnack.plastic - getFurnitureDto.plastic,
          vinyl: userSnack.vinyl - getFurnitureDto.vinyl,
          styrofoam: userSnack.styrofoam - getFurnitureDto.styrofoam,
          general: userSnack.general - getFurnitureDto.general,
          food: userSnack.food - getFurnitureDto.food,
        })
        .where('snack_id = :snack_id', { snack_id: userSnack.snack_id })
        .execute();

      if (result.affected === 0) {
        throw new NotAcceptableException('디비 저장과정에서 오류가 발생했습니다1.');
      }
    } catch (error) {
      throw error;
    }
  }
}
