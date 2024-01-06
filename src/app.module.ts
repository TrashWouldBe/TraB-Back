import { Module } from '@nestjs/common';
import { AppController } from './service/dto/app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
