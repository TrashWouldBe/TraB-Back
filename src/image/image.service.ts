import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

@Injectable()
export class ImageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(
    private configService: ConfigService,
    private readonly snackService: SnackService,
    private readonly ploggingService: PloggingService,
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

  async uploadNormalTrashImage(idToken: string, image: Express.Multer.File): Promise<string> {
    try {
      // const uid: string = await decodeToken(idToken);
      const uid: string = idToken;

      /*Todo 모델로 쓰레기 정보 알아내기*/
      const trashType = 'glass';

      // 이미지 이름을 고유하게 만들기 위해 한국 시각을 이용
      const now = new Date();
      const koreaTimeDiff = now.getTimezoneOffset() / 60;
      const koreaNow = new Date(now.getTime() - koreaTimeDiff * 60 * 60 * 1000);

      // 이미지를 cloud storage에 저장
      const imageUrl: string = await this.uploadImageToGCS(image, `${uid}/normal_trash_image/${koreaNow}.png`);

      // 주은 쓰레기의 종류를 확인하고 간식에 추가
      const snack: Snack = await this.snackService.earnSnack(uid, trashType);

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

      return imageUrl;
    } catch (error) {
      throw error;
    }
  }

  async uploadPloggingTrashImages(uid: string, ploggingId: number, images: Array<Express.Multer.File>): Promise<void> {
    try {
      // 쓰레기 종류를 저장했다가 한번만 db 접근을 하기 위함
      const trashMap = new Map([
        ['glass', 0],
        ['paper', 0],
        ['can', 0],
        ['plastic', 0],
        ['vinyl', 0],
        ['styrofoam', 0],
        ['general_waste', 0],
        ['food_waste', 0],
      ]);

      const dataArray: any[] = [];

      // 사진에 고유 이름을 붙이기 위함
      let imageIdx = 1;

      // 이미지 이름을 고유하게 만들기 위해 한국 시각을 이용
      const now = new Date();
      const koreaTimeDiff = now.getTimezoneOffset() / 60;
      const koreaNow = new Date(now.getTime() - koreaTimeDiff * 60 * 60 * 1000);

      // snack db table 찾아오기
      const snack: Snack = await this.snackService.getSnackByUid(uid);

      for (const image of images) {
        // Todo
        const trashType = 'plastic';
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

      // cloud storage에 저장한 url을 db에 저장 - 한번에 하기 위해서 bulk insert 이용
      const imageRow = await this.trashImageRepository
        .createQueryBuilder()
        .insert()
        .into(Trash_image)
        .values(dataArray)
        .execute();

      const ploggingRow: Plogging = await this.ploggingService.getPloggingByUserIdAndPloggingId(uid, ploggingId);

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
    } catch (error) {
      throw error;
    }
  }
}
