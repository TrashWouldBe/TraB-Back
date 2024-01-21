import { Module, forwardRef } from '@nestjs/common';
import { PloggingController } from './plogging.controller';
import { PloggingService } from './plogging.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plogging } from './entities/plogging.entity';
import { UserModule } from 'src/user/user.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plogging]), forwardRef(() => ImageModule), UserModule],
  controllers: [PloggingController],
  providers: [PloggingService],
  exports: [PloggingService],
})
export class PloggingModule {}
