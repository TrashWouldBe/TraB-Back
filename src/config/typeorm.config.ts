import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Plogging } from 'src/plogging/entities/plogging.entity';
import { Trash_image } from 'src/plogging/entities/trash_image.entity';
import { Snack } from 'src/snack/entities/snack.entity';
import { Furniture } from 'src/trab/entities/furniture.entity';
import { Trab } from 'src/trab/entities/trab.entity';
import { User } from 'src/user/entities/user.entity';
import { User_image } from 'src/user/entities/user_image.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const option = {
      type: configService.get('DB_TYPE'),
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [User,Trab,Snack,Plogging,Furniture,User_image,Trash_image],
      synchronize: true,
    };
    return option;
  },
};
