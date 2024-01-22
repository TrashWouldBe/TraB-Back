import { Module } from '@nestjs/common';
import { TrabController } from './trab.controller';
import { TrabService } from './trab.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trab } from './entities/trab.entity';
import { Furniture } from './entities/furniture.entity';
import { UserModule } from 'src/user/user.module';
import { SnackModule } from 'src/snack/snack.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trab, Furniture]), UserModule, SnackModule],
  controllers: [TrabController],
  providers: [TrabService],
  exports: [TrabService],
})
export class TrabModule {}
