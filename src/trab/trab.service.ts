import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trab } from './entities/trab.entity';
import { Repository } from 'typeorm';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { TrabInfoDto } from './dto/trab-info.dto';
import { SnackService } from 'src/snack/snack.service';
import { FurnitureService } from 'src/furniture/furniture.service';

@Injectable()
export class TrabService {
  constructor(
    @InjectRepository(Trab)
    private readonly trabRepository: Repository<Trab>,
    private readonly userService: UserService,
    private readonly snackService: SnackService,
    private readonly furnitureService: FurnitureService,
  ) {}

  async getTrabByUserId(uid: string): Promise<Trab> {
    try {
      const user: User = await this.userService.getUserByUserId(uid);

      const trabs: Trab[] = await this.trabRepository.find({
        where: {
          user: user,
        },
      });

      return trabs[0];
    } catch (error) {
      throw error;
    }
  }

  async getTrab(idToken: string): Promise<TrabInfoDto | null> {
    try {
      const uid: string = await decodeToken(idToken);
      const user: User = await this.userService.getUserByUserId(uid);

      const trabs: Trab[] = await this.trabRepository.find({
        where: {
          user: user,
        },
      });

      if (trabs.length === 0) return null;
      else if (trabs.length !== 1) {
        throw new NotAcceptableException('trab가 여러마리입니다.');
      } else {
        const ret: TrabInfoDto = {
          trabId: trabs[0].trab_id,
          trabName: trabs[0].trab_name,
          snackCnt: trabs[0].snack_cnt,
        };
        return ret;
      }
    } catch (error) {
      throw error;
    }
  }

  async createTrab(idToken: string, name: string): Promise<TrabInfoDto> {
    try {
      const uid: string = await decodeToken(idToken);
      const user: User = await this.userService.getUserByUserId(uid);

      await this.trabRepository
        .createQueryBuilder()
        .insert()
        .into(Trab)
        .values([
          {
            user: user,
            trab_name: name,
            snack_cnt: 0,
          },
        ])
        .execute();

      const nowTrab: Trab = await this.getTrabByUserId(uid);
      await this.snackService.createSnack(nowTrab);
      await this.furnitureService.createFurniture(nowTrab);

      const ret: TrabInfoDto = {
        trabId: nowTrab.trab_id,
        trabName: nowTrab.trab_name,
        snackCnt: nowTrab.snack_cnt,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
