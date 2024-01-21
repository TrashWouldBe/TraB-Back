import { Module } from '@nestjs/common';
import { TrabController } from './trab.controller';
import { TrabService } from './trab.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trab } from './entities/trab.entity';
import { Furniture } from './entities/furniture.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trab, Furniture]), UserModule],
  controllers: [TrabController],
  providers: [TrabService],
  exports: [TrabService],
})
export class TrabModule {}
