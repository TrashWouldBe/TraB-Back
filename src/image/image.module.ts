import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule } from '@nestjs/config';
import { SnackModule } from 'src/snack/snack.module';

@Module({
  imports: [ConfigModule, SnackModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
