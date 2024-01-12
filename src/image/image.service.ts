import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
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

  async uploadImage(image: Express.Multer.File): Promise<string> {
    await this.bucket.file('profile-image/image.png').save(image.buffer);
    return `https://storage.googleapis.com/${this.bucket.name}/image.png`;
  }
}
