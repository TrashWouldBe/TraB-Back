import { Module } from '@nestjs/common';
import { TrabController } from './trab.controller';
import { TrabService } from './trab.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trab } from './entities/trab.entity';
import { Furniture } from '../furniture/entities/furniture.entity';
import { UserModule } from 'src/user/user.module';
import { SnackModule } from 'src/snack/snack.module';
import { FurnitureModule } from 'src/furniture/furniture.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trab, Furniture]), UserModule, SnackModule, FurnitureModule],
  controllers: [TrabController],
  providers: [TrabService],
  exports: [TrabService],
})
export class TrabModule {}
