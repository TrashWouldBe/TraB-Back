import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { TrabModule } from './trab/trab.module';
import { PloggingModule } from './plogging/plogging.module';
import { SnackModule } from './snack/snack.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    FirebaseModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    UserModule,
    TrabModule,
    PloggingModule,
    SnackModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
