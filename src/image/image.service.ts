import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      credentials: JSON.parse(configService.get<string>('CLOUD_STORAGE_KEY')),
    });
    this.bucket = this.storage.bucket('trab-image');
  }

  async uploadImage(image: Express.Multer.File, type: string, param: string | null): Promise<string> {
    try {
      if (type === 'test') {
        await this.bucket.file('profile-image/image.png').save(image.buffer);
        return `https://storage.googleapis.com/${this.bucket.name}/image.png`;
      } else if (type === 'profile') {
        await this.bucket.file(`profile-image/${param}/image.png`).save(image.buffer);
        return `https://storage.googleapis.com/${this.bucket.name}/profile-image/${param}/image.png`;
      }
    } catch (error) {
      throw new InternalServerErrorException('이미지를 저장하는 과정에서 오류가 발생했습니다.');
    }
  }
}
