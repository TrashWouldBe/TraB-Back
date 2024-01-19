import { Module } from '@nestjs/common';
import { SnackController } from './snack.controller';
import { SnackService } from './snack.service';
import { Snack } from './entities/snack.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Snack])],
  controllers: [SnackController],
  providers: [SnackService],
  exports: [SnackService],
})
export class SnackModule {}
