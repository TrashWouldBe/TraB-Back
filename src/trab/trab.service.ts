import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trab } from './entities/trab.entity';
import { Repository } from 'typeorm';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { TrabInfoDto } from './dto/trab-info.dto';
import { SnackService } from 'src/snack/snack.service';
import { Furniture } from './entities/furniture.entity';
import { FURNITURE_LIST } from 'src/common/constants/furniture-list';
import { FurnitureInfoDto } from './dto/furniture-info.dto';
import { SnackDto } from 'src/snack/dto/snack.dto';

@Injectable()
export class TrabService {
  constructor(
    @InjectRepository(Trab)
    private readonly trabRepository: Repository<Trab>,
    @InjectRepository(Furniture)
    private readonly furnitureRepository: Repository<Furniture>,
    private readonly userService: UserService,
    private readonly snackService: SnackService,
  ) {}

  async getTrabByUserId(uid: string): Promise<Trab> {
    try {
      const user: User = await this.userService.getUserByUserId(uid);

      const trabs: Trab[] = await this.trabRepository.find({
        where: {
          user: user,
        },
      });

      return trabs[0];
    } catch (error) {
      throw error;
    }
  }

  async getTrab(idToken: string): Promise<TrabInfoDto | null> {
    try {
      const uid: string = await decodeToken(idToken);
      const user: User = await this.userService.getUserByUserId(uid);

      const trabs: Trab[] = await this.trabRepository.find({
        where: {
          user: user,
        },
      });

      if (trabs.length === 0) return null;
      else if (trabs.length !== 1) {
        throw new NotAcceptableException('trab가 여러마리입니다.');
      } else {
        const ret: TrabInfoDto = {
          trabId: trabs[0].trab_id,
          trabName: trabs[0].trab_name,
          snackCnt: trabs[0].snack_cnt,
        };
        return ret;
      }
    } catch (error) {
      throw error;
    }
  }

  async createFurniture(trab: Trab): Promise<void> {
    try {
      const dataArray: any[] = [];

      for (const furniture of Object.values(FURNITURE_LIST)) {
        dataArray.push({
          trab: trab,
          name: furniture.furnitureName,
          is_arrange: false,
          is_get: false,
        });
      }

      await this.furnitureRepository.createQueryBuilder().insert().into(Furniture).values(dataArray).execute();
    } catch (error) {
      throw error;
    }
  }

  async createTrab(idToken: string, name: string): Promise<TrabInfoDto> {
    try {
      const uid: string = await decodeToken(idToken);
      const user: User = await this.userService.getUserByUserId(uid);

      await this.trabRepository
        .createQueryBuilder()
        .insert()
        .into(Trab)
        .values([
          {
            user: user,
            trab_name: name,
            snack_cnt: 0,
          },
        ])
        .execute();

      const nowTrab: Trab = await this.getTrabByUserId(uid);
      await this.snackService.createSnack(nowTrab);
      await this.createFurniture(nowTrab);

      const ret: TrabInfoDto = {
        trabId: nowTrab.trab_id,
        trabName: nowTrab.trab_name,
        snackCnt: nowTrab.snack_cnt,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getFurnitureList(trabId: number): Promise<FurnitureInfoDto[]> {
    try {
      const furnitures: Furniture[] = await this.furnitureRepository.find({
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

      const ret: FurnitureInfoDto[] = [];

      furnitures.forEach((furniture) => {
        const temp: FurnitureInfoDto = {
          furnitureId: furniture.furniture_id,
          name: furniture.name,
          isArrange: furniture.is_arrange,
          isGet: furniture.is_get,
        };

        ret.push(temp);
      });

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getFurnitureInfo(furnitureName: string): Promise<SnackDto> {
    try {
      const furnitures = Object.values(FURNITURE_LIST);

      const targetFurniture = furnitures.find((furniture) => furniture.furnitureName === furnitureName);

      const ret: SnackDto = {
        glass: targetFurniture.glass,
        paper: targetFurniture.paper,
        can: targetFurniture.can,
        plastic: targetFurniture.plastic,
        vinyl: targetFurniture.vinyl,
        styrofoam: targetFurniture.styrofoam,
        general_waste: targetFurniture.general_waste,
        food_waste: targetFurniture.food_waste,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getArrangedFurnitureList(trabId: number): Promise<FurnitureInfoDto[]> {
    try {
      const furnitures: Furniture[] = await this.furnitureRepository.find({
        select: {
          trab: {
            trab_id: true,
          },
        },
        where: {
          trab: {
            trab_id: trabId,
          },
          is_arrange: true,
        },
      });

      const ret: FurnitureInfoDto[] = [];

      furnitures.forEach((furniture) => {
        const temp: FurnitureInfoDto = {
          furnitureId: furniture.furniture_id,
          name: furniture.name,
          isArrange: furniture.is_arrange,
          isGet: furniture.is_get,
        };

        ret.push(temp);
      });

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
