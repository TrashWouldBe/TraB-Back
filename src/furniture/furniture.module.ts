import { Module, forwardRef } from '@nestjs/common';
import { FurnitureController } from './furniture.controller';
import { FurnitureService } from './furniture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Furniture } from './entities/furniture.entity';
import { SnackModule } from 'src/snack/snack.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Furniture]), forwardRef(() => SnackModule), forwardRef(() => ImageModule)],
  controllers: [FurnitureController],
  providers: [FurnitureService],
  exports: [FurnitureService],
})
export class FurnitureModule {}
