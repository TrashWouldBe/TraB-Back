import { Module, forwardRef } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule } from '@nestjs/config';
import { SnackModule } from 'src/snack/snack.module';
import { Trash_image } from './entities/trash_image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PloggingModule } from 'src/plogging/plogging.module';
import { Plogging_image_relation } from './entities/plogging_image_relation.entity';
import { TrabModule } from 'src/trab/trab.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trash_image, Plogging_image_relation]),
    ConfigModule,
    forwardRef(() => SnackModule),
    forwardRef(() => PloggingModule),
    forwardRef(() => TrabModule),
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
