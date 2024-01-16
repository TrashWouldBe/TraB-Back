import { Module } from '@nestjs/common';
import { SnackController } from './snack.controller';

@Module({
  controllers: [SnackController],
})
export class SnackModule {}
