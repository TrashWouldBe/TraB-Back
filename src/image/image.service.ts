import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { SnackService } from 'src/snack/snack.service';

@Injectable()
export class ImageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(private configService: ConfigService, private readonly snackService: SnackService) {
    this.storage = new Storage({
      credentials: JSON.parse(configService.get<string>('CLOUD_STORAGE_KEY')),
    });
    this.bucket = this.storage.bucket('trab-image');
  }

  async uploadProfileImage(image: Express.Multer.File, uid: string): Promise<string> {
    try {
      await this.bucket.file(`${uid}/profile-image/profile.png`).save(image.buffer);
      return `https://storage.googleapis.com/${this.bucket.name}/${uid}/profile-image/profile.png`;
    } catch (error) {
      throw new InternalServerErrorException('이미지를 저장하는 과정에서 오류가 발생했습니다.');
    }
  }

  async uploadTrashImage(
    idToken: string,
    trashType: string,
    imageType: string,
    image: Express.Multer.File,
  ): Promise<string> {
    try {
      const uid: string = await decodeToken(idToken);

      await this.snackService.earnSnack(uid, trashType);

      const now = new Date();
      const koreaTimeDiff = now.getTimezoneOffset() / 60;
      const koreaNow = new Date(now.getTime() - koreaTimeDiff * 60 * 60 * 1000);

      if (imageType === 'normal') {
        await this.bucket.file(`${uid}/normal-trash-image/${koreaNow}.png`).save(image.buffer);
        return `https://storage.googleapis.com/${this.bucket.name}/${uid}/normal-trash-image/${koreaNow}.png`;
      }
    } catch (error) {
      throw error;
    }
  }
}
