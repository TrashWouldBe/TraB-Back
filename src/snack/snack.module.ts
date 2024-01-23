import { Module } from '@nestjs/common';
import { SnackController } from './snack.controller';
import { SnackService } from './snack.service';
import { Snack } from './entities/snack.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trash_image } from 'src/image/entities/trash_image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Snack, Trash_image])],
  controllers: [SnackController],
  providers: [SnackService, Trash_image],
  exports: [SnackService],
})
export class SnackModule {}
