import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Plogging } from './entities/plogging.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ImageService } from 'src/image/image.service';
import { ReturnPloggingInfoDto } from './dto/return-plogging-info.dto';
import { GetPloggingInfoDto } from './dto/get-plogging-info.dto';
import { ReturnTrashImageDto } from 'src/image/dto/return-trash-image.dto';

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

  async getPloggingByPloggingId(ploggingId: number): Promise<Plogging> {
    try {
      const plogging: Plogging[] = await this.ploggingRepository.find({
        where: {
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
    getPloggingInfoDto: GetPloggingInfoDto,
    images?: Array<Express.Multer.File>,
  ): Promise<ReturnTrashImageDto[]> {
    try {
      const uid: string = await decodeToken(idToken);

      const trabSnack: number = images?.length ?? 0;
      const user: User = await this.userService.getUserByUserId(uid);

      const newPlogging = await this.ploggingRepository
        .createQueryBuilder()
        .insert()
        .into(Plogging)
        .values([
          {
            user: user,
            run_date: getPloggingInfoDto.runDate,
            run_name: getPloggingInfoDto.runName,
            run_range: getPloggingInfoDto.runRange,
            run_time: getPloggingInfoDto.runTime,
            trab_snack: trabSnack,
          },
        ])
        .execute();

      if (images) {
        const data: ReturnTrashImageDto[] = await this.imageService.uploadPloggingTrashImages(
          uid,
          newPlogging.generatedMaps[0].plogging_id,
          images,
        );
        return data;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  async getPloggingList(token: string): Promise<ReturnPloggingInfoDto[]> {
    try {
      const uid: string = await decodeToken(token);

      const ploggings: Plogging[] = await this.ploggingRepository.find({
        where: {
          user: {
            uid: uid,
          },
        },
        order: {
          plogging_id: 'ASC',
        },
      });

      const ret: ReturnPloggingInfoDto[] = [];

      ploggings.forEach((plogging) => {
        const temp: ReturnPloggingInfoDto = {
          ploggingId: plogging.plogging_id,
          runDate: plogging.run_date,
          runName: plogging.run_name,
          runRange: plogging.run_range,
          runTime: plogging.run_time,
          trabSnack: plogging.trab_snack,
        };

        ret.push(temp);
      });

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async getPloggingInfo(pid: number): Promise<ReturnPloggingInfoDto> {
    try {
      const targetPlogging: Plogging = await this.getPloggingByPloggingId(pid);

      const ret: ReturnPloggingInfoDto = {
        ploggingId: targetPlogging.plogging_id,
        runDate: targetPlogging.run_date,
        runName: targetPlogging.run_name,
        runRange: targetPlogging.run_range,
        runTime: targetPlogging.run_time,
        trabSnack: targetPlogging.trab_snack,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
