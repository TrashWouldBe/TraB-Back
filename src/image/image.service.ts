import { Bucket, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class ImageService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      keyFilename: JSON.parse(configService.get<string>('CLOUD_STORAGE_KEY')),
    });
    this.bucket = this.storage.bucket('trab-image');
  }

  async uploadImage(image: Express.Multer.File): Promise<void> {
    const filePath = path.join('trab-image/profile-image', image.filename);
    const file = this.bucket.file(filePath);
  }
}
