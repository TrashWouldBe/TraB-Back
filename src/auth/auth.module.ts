import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [FirebaseModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
