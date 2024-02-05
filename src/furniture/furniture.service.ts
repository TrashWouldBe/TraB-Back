import { Inject, Injectable, NotAcceptableException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Furniture } from './entities/furniture.entity';
import { Repository } from 'typeorm';
import { Trab } from 'src/trab/entities/trab.entity';
import { FURNITURE_LIST } from 'src/common/constants/furniture-list';
import { ReturnFurnitureInfoDto } from './dto/return-furniture-info.dto';
import { SnackService } from 'src/snack/snack.service';
import { ImageService } from 'src/image/image.service';
import { GetFurnitureDto } from './dto/get-furniture.dto';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectRepository(Furniture)
    private readonly furnitureRepository: Repository<Furniture>,
    @Inject(forwardRef(() => SnackService))
    private readonly snackService: SnackService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
  ) {}

  async getFurnitureByTrabId(trabId: number): Promise<Furniture[]> {
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

      return furnitures;
    } catch (error) {
      throw error;
    }
  }

  async getFurnitureByTrabIdAndFurnitureName(trabId: number, furnitureName: string): Promise<Furniture> {
    try {
      const furniutres: Furniture[] = await this.furnitureRepository.find({
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

      if (furniutres.length !== 1) {
        throw new NotFoundException('가구 정보를 찾는 과정에서 오류가 발생했습니다.');
      }

      return furniutres[0];
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

  async getFurnitureList(trabId: number): Promise<ReturnFurnitureInfoDto[]> {
    try {
      const furnitures: Furniture[] = await this.getFurnitureByTrabId(trabId);

      const ret: ReturnFurnitureInfoDto[] = [];

      furnitures.forEach((furniture) => {
        const temp: ReturnFurnitureInfoDto = {
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

  async getArrangedFurnitureList(trabId: number): Promise<ReturnFurnitureInfoDto[]> {
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

      const ret: ReturnFurnitureInfoDto[] = [];

      furnitures.forEach((furniture) => {
        const temp: ReturnFurnitureInfoDto = {
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

  async makeFurniture(trabId: number, getFurnitureDto: GetFurnitureDto): Promise<ReturnFurnitureInfoDto> {
    try {
      /*
        1. snack table을 가져옴
        2. furniture 필요 간식 개수 가져옴
        3. snack을 소모가 가능한지 판단
        4. snack table에서 그만큼 소모 시킴 
        5. 쓰레기 사진을 is_used로 변경
        6. furniture table에 is_get 변수 true로 변경
      */

      // 0 데이터 전처리
      getFurnitureDto.glass = getFurnitureDto.glass ?? 0;
      getFurnitureDto.paper = getFurnitureDto.paper ?? 0;
      getFurnitureDto.can = getFurnitureDto.can ?? 0;
      getFurnitureDto.plastic = getFurnitureDto.plastic ?? 0;
      getFurnitureDto.vinyl = getFurnitureDto.vinyl ?? 0;
      getFurnitureDto.styrofoam = getFurnitureDto.styrofoam ?? 0;
      getFurnitureDto.general = getFurnitureDto.general ?? 0;
      getFurnitureDto.food = getFurnitureDto.food ?? 0;

      // 1 2 3 4
      await this.snackService.useSnack(trabId, getFurnitureDto);

      // 5
      await this.imageService.useTrash(trabId, getFurnitureDto);

      // 6
      const result = await this.furnitureRepository
        .createQueryBuilder()
        .update(Furniture)
        .set({ is_get: true })
        .where('trab_id = :trab_id', { trab_id: trabId })
        .andWhere('name = :name', { name: getFurnitureDto.furnitureName })
        .execute();

      if (result.affected === 0) {
        throw new NotAcceptableException('디비 저장과정에서 오류가 발생했습니다2.');
      }

      // 7. 실행이 잘 되었는지 쿼리 한 번을 더 날려봄 (어차피 make Furniture을 자주 하지 않으므로 추가함)
      const check: Furniture = await this.getFurnitureByTrabIdAndFurnitureName(trabId, getFurnitureDto.furnitureName);

      const ret: ReturnFurnitureInfoDto = {
        furnitureId: check.furniture_id,
        name: check.name,
        isArrange: check.is_arrange,
        isGet: check.is_get,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
