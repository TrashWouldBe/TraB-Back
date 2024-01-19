import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule } from '@nestjs/config';
import { SnackModule } from 'src/snack/snack.module';
import { Trash_image } from './entities/trash_image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PloggingModule } from 'src/plogging/plogging.module';
import { Plogging_image_relation } from './entities/plogging_image_relation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trash_image, Plogging_image_relation]),
    ConfigModule,
    SnackModule,
    PloggingModule,
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
