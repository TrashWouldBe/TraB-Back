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

  async uploadProfileImage(image: Express.Multer.File, uid: string): Promise<string> {
    try {
      await this.bucket.file(`${uid}/profile-image/profile.png`).save(image.buffer);
      // return `https://storage.googleapis.com/${this.bucket.name}/${uid}/profile-image/profile.png`;
      return `https://storage.googleapis.com/${
        this.bucket.name
      }/${uid}/profile-image/profile.png?timestamp=${Date.now()}`;
    } catch (error) {
      throw new InternalServerErrorException('이미지를 저장하는 과정에서 오류가 발생했습니다.');
    }
  }

  async uploadNormalTrashImage(idToken: string, trashType: string, image: Express.Multer.File): Promise<string> {
    try {
      const uid: string = await decodeToken(idToken);
      // const uid: string = idToken;

      // 주은 쓰레기의 종류를 확인하고 간식에 추가
      await this.snackService.earnSnack(uid, trashType);

      // 이미지 이름을 고유하게 만들기 위해 한국 시각을 이용
      const now = new Date();
      const koreaTimeDiff = now.getTimezoneOffset() / 60;
      const koreaNow = new Date(now.getTime() - koreaTimeDiff * 60 * 60 * 1000);

      // 이미지를 cloud storage에 저장
      await this.bucket.file(`${uid}/normal_trash_image/${koreaNow}.png`).save(image.buffer);

      // cloud storage에 저장한 url을 db에 저장
      const snack: Snack = await this.snackService.getSnackByUid(uid);
      const imageUrl = `https://storage.googleapis.com/${this.bucket.name}/${uid}/normal_trash_image/${koreaNow}.png`;

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

  async uploadPloggingTrashImage(
    idToken: string,
    trashType: string,
    ploggingId: number,
    image: Express.Multer.File,
  ): Promise<string> {
    try {
      // const uid: string = await decodeToken(idToken);
      const uid: string = idToken;

      // 주은 쓰레기의 종류를 확인하고 간식에 추가
      await this.snackService.earnSnack(uid, trashType);

      // 이미지 이름을 고유하게 만들기 위해 한국 시각을 이용
      const now = new Date();
      const koreaTimeDiff = now.getTimezoneOffset() / 60;
      const koreaNow = new Date(now.getTime() - koreaTimeDiff * 60 * 60 * 1000);

      // 이미지를 cloud storage에 저장
      await this.bucket.file(`${uid}/plogging_trash_image/${ploggingId}/${koreaNow}.png`).save(image.buffer);

      // cloud storage에 저장한 url을 db에 저장
      const snack: Snack = await this.snackService.getSnackByUid(uid);
      const imageUrl = `https://storage.googleapis.com/${this.bucket.name}/${uid}/plogging_trash_image/${ploggingId}/${koreaNow}.png`;

      const imageRow = await this.trashImageRepository
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

      const ploggingRow: Plogging = await this.ploggingService.getPloggingByUserIdAndPloggingId(uid, ploggingId);

      await this.ploggingImageRelationRepository
        .createQueryBuilder()
        .insert()
        .into(Plogging_image_relation)
        .values([
          {
            trash_image: imageRow[0],
            plogging: ploggingRow,
          },
        ]);

      return imageUrl;
    } catch (error) {
      throw error;
    }
  }
}
