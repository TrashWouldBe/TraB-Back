import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trab } from './entities/trab.entity';
import { Repository } from 'typeorm';
import { decodeToken } from 'src/common/utils/decode-idtoken';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ReturnTrabInfoDto } from './dto/return-trab-info.dto';
import { SnackService } from 'src/snack/snack.service';
import { FurnitureService } from 'src/furniture/furniture.service';

@Injectable()
export class TrabService {
  constructor(
    @InjectRepository(Trab)
    private readonly trabRepository: Repository<Trab>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => SnackService))
    private readonly snackService: SnackService,
    @Inject(forwardRef(() => FurnitureService))
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

  async getTrab(idToken: string): Promise<ReturnTrabInfoDto | null> {
    try {
      const uid: string = await decodeToken(idToken);

      const trab: Trab = await this.getTrabByUserId(uid);

      const ret: ReturnTrabInfoDto = {
        trabId: trab.trab_id,
        trabName: trab.trab_name,
        snackCnt: trab.snack_cnt,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async createTrab(idToken: string, name: string): Promise<ReturnTrabInfoDto> {
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

      const ret: ReturnTrabInfoDto = {
        trabId: nowTrab.trab_id,
        trabName: nowTrab.trab_name,
        snackCnt: nowTrab.snack_cnt,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async patchTrab(idToken: string, trab_id: number, name: string): Promise<ReturnTrabInfoDto> {
    try {
      const uid: string = await decodeToken(idToken);

      await this.trabRepository
        .createQueryBuilder()
        .update(Trab)
        .set({ trab_name: name })
        .where('trab_id = :trab_id', { trab_id: trab_id })
        .execute();

      const nowTrab: Trab = await this.getTrabByUserId(uid);

      const ret: ReturnTrabInfoDto = {
        trabId: nowTrab.trab_id,
        trabName: nowTrab.trab_name,
        snackCnt: nowTrab.snack_cnt,
      };

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async changeTrabSnackCnt(uid: string, snackCnt: number): Promise<void> {
    try {
      const userTrab: Trab = await this.getTrabByUserId(uid);
      const newUserTrabSnackCnt: number = userTrab.snack_cnt + snackCnt;

      await this.trabRepository
        .createQueryBuilder()
        .update(Trab)
        .set({ snack_cnt: newUserTrabSnackCnt })
        .where('trab_id = :trab_id', { trab_id: userTrab.trab_id })
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
