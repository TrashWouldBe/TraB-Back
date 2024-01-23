import { Module, forwardRef } from '@nestjs/common';
import { SnackController } from './snack.controller';
import { SnackService } from './snack.service';
import { Snack } from './entities/snack.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Snack]), forwardRef(() => ImageModule)],
  controllers: [SnackController],
  providers: [SnackService],
  exports: [SnackService],
})
export class SnackModule {}
