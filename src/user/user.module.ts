import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ImageModule } from 'src/image/image.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ImageModule), FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
