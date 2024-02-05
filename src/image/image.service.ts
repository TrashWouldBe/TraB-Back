import { Bucket, Storage } from '@google-cloud/storage';
import { Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { SnackService } from 'src/snack/snack.service';
import { Trash_image } from './entities/trash_image.entity';
import { Repository } from 'typeorm';
import { Snack } from 'src/snack/entities/snack.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Plogging_image_relation } from './entities/plogging_image_relation.entity';
import { PloggingService } from 'src/plogging/plogging.service';
import { Plogging } from 'src/plogging/entities/plogging.entity';
import { predictImages } from 'src/common/utils/predict-images';
import { ReturnTrashImageDto } from './dto/return-trash-image.dto';
import { GetFurnitureDto } from 'src/furniture/dto/get-furniture.dto';
import { TrabService } from 'src/trab/trab.service';
import { getKoreaTime } from 'src/common/utils/get-korea-time';

@Injectable()
export class ImageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => SnackService))
    private readonly snackService: SnackService,
    @Inject(forwardRef(() => PloggingService))
    private readonly ploggingService: PloggingService,
    @Inject(forwardRef(() => TrabService))
    private readonly trabService: TrabService,
    @InjectRepository(Plogging_image_relation)
    private readonly ploggingImageRelationRepository: Repository<Plogging_image_relation>,
    @InjectRepository(Trash_image)
    private readonly trashImageRepository: Repository<Trash_image>,
  ) {
    this.storage = new Storage({
      credentials: JSON.parse(configService.get<string>('CLOUD_STORAGE_KEY')),
    });
    this.bucket = this.storage.bucket('trab-image');
  }

  async uploadImageToGCS(image: Express.Multer.File, imagePath: string): Promise<string> {
    try {
      await this.bucket.file(imagePath).save(image.buffer);
      return `https://storage.googleapis.com/${this.bucket.name}/${imagePath}?timestamp=${Date.now()}`;
    } catch (error) {
      throw new InternalServerErrorException('이미지를 저장하는 과정에서 오류가 발생했습니다.');
    }
  }

  async uploadProfileImage(image: Express.Multer.File, uid: string): Promise<string> {
    try {
      return await this.uploadImageToGCS(image, `${uid}/profile-image/profile.png`);
    } catch (error) {
      throw error;
    }
  }

  async uploadNormalTrashImage(idToken: string, image: Express.Multer.File): Promise<ReturnTrashImageDto> {
    try {
      const uid: string = await decodeToken(idToken);

      const images: Array<Express.Multer.File> = [];
      images.push(image);

      // 모델로 쓰레기 정보 알아내기
      const trashTypes: string[] = await predictImages(images);
      const trashType: string = trashTypes[0];

      // 이미지 이름을 고유하게 만들기 위해 한국 시각을 이용
      const koreaNow = await getKoreaTime();

      // 이미지를 cloud storage에 저장
      const imageUrl: string = await this.uploadImageToGCS(image, `${uid}/normal_trash_image/${koreaNow}.png`);

      // 주은 쓰레기의 종류를 확인하고 간식에 추가
      const snack: Snack = await this.snackService.earnSnack(uid, trashType);

      // 주은 간식 수 트레비에 업데이트
      await this.trabService.changeTrabSnackCnt(uid, 1);

      // cloud storage에 저장한 url을 db에 저장
      await this.trashImageRepository
        .createQueryBuilder()
        .insert()
        .into(Trash_image)
        .values([
          {
            snack: snack,
            image: imageUrl,
            trash_tag: trashType,
            date: koreaNow,
          },
        ])
        .execute();

      const ret: ReturnTrashImageDto = {
        imageUrl: imageUrl,
        trashType: trashType,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async uploadPloggingTrashImages(
    uid: string,
    ploggingId: number,
    images: Array<Express.Multer.File>,
  ): Promise<ReturnTrashImageDto[]> {
    try {
      // 쓰레기 종류를 저장했다가 한번만 db 접근을 하기 위함
      const trashMap = new Map([
        ['glass', 0],
        ['paper', 0],
        ['metal', 0],
        ['plastic', 0],
        ['vinyl', 0],
        ['styrofoam', 0],
        ['general', 0],
        ['food', 0],
      ]);

      const dataArray: any[] = [];

      // 사진에 고유 이름을 붙이기 위함
      let imageIdx = 1;

      // 이미지 이름을 고유하게 만들기 위해 한국 시각을 이용
      const koreaNow = await getKoreaTime();

      // snack db table 찾아오기
      const snack: Snack = await this.snackService.getSnackByUserId(uid);

      // 쓰레기 이미지 종류 model로 예측
      const trashTypes: string[] = await predictImages(images);
      let idx = 0;

      // 쓰레기 사진 storage에 저장하고 쓰레기 종류 몹기
      for (const image of images) {
        const trashType = trashTypes[idx++];
        trashMap.set(trashType, trashMap.get(trashType) + 1);

        // 이미지를 cloud storage에 저장
        const imageUrl = await this.uploadImageToGCS(
          image,
          `${uid}/plogging_trash_image/plogging_${ploggingId}/${koreaNow}_${imageIdx}.png`,
        );

        dataArray.push({
          snack: snack,
          image: imageUrl,
          trash_tag: trashType,
          date: koreaNow,
        });

        imageIdx++;
      }

      // 주은 쓰레기의 종류를 확인하고 간식에 추가
      await this.snackService.earnSnacks(uid, trashMap);

      // 주은 간식 수 트레비에 업데이트
      await this.trabService.changeTrabSnackCnt(uid, images.length);

      // cloud storage에 저장한 url을 db에 저장 - 한번에 하기 위해서 bulk insert 이용
      const imageRow = await this.trashImageRepository
        .createQueryBuilder()
        .insert()
        .into(Trash_image)
        .values(dataArray)
        .execute();

      const ploggingRow: Plogging = await this.ploggingService.getPloggingByPloggingId(ploggingId);

      const ploggingImageRelations = imageRow.generatedMaps.map((image) => ({
        trash_image: image,
        plogging: ploggingRow,
      }));

      await this.ploggingImageRelationRepository
        .createQueryBuilder()
        .insert()
        .into(Plogging_image_relation)
        .values(ploggingImageRelations)
        .execute();

      const ret: ReturnTrashImageDto[] = dataArray.map((data) => ({
        imageUrl: data.image,
        trashType: data.trash_tag,
      }));

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getTrashImagesBySnackId(snackId: number): Promise<Trash_image[]> {
    try {
      const trashImages: Trash_image[] = await this.trashImageRepository.find({
        where: {
          snack: {
            snack_id: snackId,
          },
          is_used: false,
        },
        order: {
          image_id: 'ASC',
        },
      });
      return trashImages;
    } catch (error) {
      throw error;
    }
  }

  async getTotalTrashImagesBySnackId(snackId: number): Promise<Trash_image[]> {
    try {
      const trashImages: Trash_image[] = await this.trashImageRepository.find({
        where: {
          snack: {
            snack_id: snackId,
          },
        },
        order: {
          image_id: 'ASC',
        },
      });
      return trashImages;
    } catch (error) {
      throw error;
    }
  }

  async makeIsUsedTrue(snackId: number, trashTag: string, cnt: number): Promise<void> {
    try {
      if (cnt === 0) return;

      const trashImages: Trash_image[] = await this.trashImageRepository.find({
        where: {
          snack: {
            snack_id: snackId,
          },
          trash_tag: trashTag,
          is_used: false,
        },
        order: {
          date: 'ASC',
        },
        take: cnt,
      });

      for (const trashImage of trashImages) {
        await this.trashImageRepository
          .createQueryBuilder()
          .update(Trash_image)
          .set({ is_used: true })
          .where('image_id = :id', { id: trashImage.image_id })
          .execute();
      }
    } catch (error) {
      throw error;
    }
  }

  async useTrash(trabId: number, getFurnitureDto: GetFurnitureDto): Promise<void> {
    try {
      const snack: Snack = await this.snackService.getSnackByTrabId(trabId);

      // const furnitures = Object.values(FURNITURE_LIST);
      // const targetFurniture = furnitures.find((furniture) => furniture.furnitureName === furnitureName);

      await this.makeIsUsedTrue(snack.snack_id, 'glass', getFurnitureDto.glass);
      await this.makeIsUsedTrue(snack.snack_id, 'paper', getFurnitureDto.paper);
      await this.makeIsUsedTrue(snack.snack_id, 'metal', getFurnitureDto.metal);
      await this.makeIsUsedTrue(snack.snack_id, 'plastic', getFurnitureDto.plastic);
      await this.makeIsUsedTrue(snack.snack_id, 'vinyl', getFurnitureDto.vinyl);
      await this.makeIsUsedTrue(snack.snack_id, 'styrofoam', getFurnitureDto.styrofoam);
      await this.makeIsUsedTrue(snack.snack_id, 'general', getFurnitureDto.general);
      await this.makeIsUsedTrue(snack.snack_id, 'food', getFurnitureDto.food);
    } catch (error) {
      throw error;
    }
  }

  async getUsedTrash(trabId: number): Promise<number[]> {
    try {
      const retArray: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

      const trashImages: Trash_image[] = await this.trashImageRepository.find({
        where: {
          snack: {
            trab: {
              trab_id: trabId,
            },
          },
          is_used: true,
        },
      });

      for (const image of trashImages) {
        if (image.trash_tag === 'glass') {
          retArray[0]++;
        } else if (image.trash_tag === 'paper') {
          retArray[1]++;
        } else if (image.trash_tag === 'metal') {
          retArray[2]++;
        } else if (image.trash_tag === 'plastic') {
          retArray[3]++;
        } else if (image.trash_tag === 'vinyl') {
          retArray[4]++;
        } else if (image.trash_tag === 'styrofoam') {
          retArray[5]++;
        } else if (image.trash_tag === 'general') {
          retArray[6]++;
        } else if (image.trash_tag === 'food') {
          retArray[7]++;
        }
      }

      return retArray;
    } catch (error) {
      throw error;
    }
  }
}
