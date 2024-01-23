import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Furniture } from './entities/furniture.entity';
import { Repository } from 'typeorm';
import { Trab } from 'src/trab/entities/trab.entity';
import { FURNITURE_LIST } from 'src/common/constants/furniture-list';
import { FurnitureInfoDto } from './dto/furniture-info.dto';
import { SnackDto } from 'src/snack/dto/snack.dto';
import { MakeFurnitureDto } from './dto/make-furniture.dto';
import { SnackService } from 'src/snack/snack.service';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectRepository(Furniture)
    private readonly furnitureRepository: Repository<Furniture>,
    private readonly snackService: SnackService,
  ) {}

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

  async makeFurniture(makeFurnitureDto: MakeFurnitureDto): Promise<FurnitureInfoDto> {
    try {
      /*
        1. snack table을 가져옴
        2. furniture 필요 간식 개수 가져옴
        3. snack을 소모가 가능한지 판단
        4. snack table에서 그만큼 소모 시킴 
        5. furniture table에 is_get 변수 true로 변경
      */
      const trabId: number = makeFurnitureDto.trabId;
      const furnitureName: string = makeFurnitureDto.furnitureName;

      // 1 2 3 4
      await this.snackService.useSnack(trabId, furnitureName);

      // 5
      const result = await this.furnitureRepository
        .createQueryBuilder()
        .update(Furniture)
        .set({ is_get: true })
        .where('trab_id = :trab_id', { trab_id: trabId })
        .andWhere('name = :name', { name: furnitureName })
        .execute();

      if (result.affected === 0) {
        throw new NotAcceptableException('디비 저장과정에서 오류가 발생했습니다2.');
      }

      // 6. 실행이 잘 되었는지 쿼리 한 번을 더 날려봄 (어차피 make Furniture을 자주 하지 않으므로 추가함)
      const check: Furniture[] = await this.furnitureRepository.find({
        select: {
          trab: {
            trab_id: true,
          },
        },
        where: {
          trab: {
            trab_id: trabId,
          },
          name: furnitureName,
        },
      });

      const ret: FurnitureInfoDto = {
        furnitureId: check[0].furniture_id,
        name: check[0].name,
        isArrange: check[0].is_arrange,
        isGet: check[0].is_get,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
