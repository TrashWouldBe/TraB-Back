import { Module } from '@nestjs/common';
import { PloggingController } from './plogging.controller';
import { PloggingService } from './plogging.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plogging } from './entities/plogging.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plogging])],
  controllers: [PloggingController],
  providers: [PloggingService],
  exports: [PloggingService],
})
export class PloggingModule {}
