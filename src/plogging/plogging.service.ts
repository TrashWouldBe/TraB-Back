import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Plogging } from './entities/plogging.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PloggingInfoDto } from './dto/plogging-info.dto';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ImageService } from 'src/image/image.service';
import { FilesUploadDto } from './dto/plogging-upload.dto';

@Injectable()
export class PloggingService {
  constructor(
    @InjectRepository(Plogging)
    private readonly ploggingRepository: Repository<Plogging>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
  ) {}

  async getPloggingByUserIdAndPloggingId(uid: string, ploggingId: number): Promise<Plogging> {
    try {
      const plogging: Plogging[] = await this.ploggingRepository.find({
        relations: {
          user: true,
        },
        where: {
          user: {
            uid: uid,
          },
          plogging_id: ploggingId,
        },
      });

      if (plogging.length !== 1) {
        throw new NotFoundException('해당 플로깅을 찾을 수 업습니다.');
      }

      return plogging[0];
    } catch (error) {
      throw error;
    }
  }

  async uploadPlogging(
    idToken: string,
    images: Array<Express.Multer.File>,
    ploggingInfoDto: PloggingInfoDto,
  ): Promise<User> {
    try {
      const uid: string = await decodeToken(idToken);

      const trabSnack: number = images.length;
      const user: User = await this.userService.getUserByUserId(uid);

      const newPlogging = await this.ploggingRepository
        .createQueryBuilder()
        .insert()
        .into(Plogging)
        .values([
          {
            user: user,
            run_date: ploggingInfoDto.runDate,
            run_name: ploggingInfoDto.runName,
            run_range: ploggingInfoDto.runRange,
            run_time: ploggingInfoDto.runTime,
            trab_snack: trabSnack,
            calorie: 0, // 아직 칼로리 처리는 안함
          },
        ])
        .execute();

      await this.imageService.uploadPloggingTrashImages(uid, newPlogging.generatedMaps[0].plogging_id, images);

      return newPlogging[0];
    } catch (error) {
      throw error;
    }
  }
}
