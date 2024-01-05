import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginResultType } from 'src/common/constant/login-result-type';
import * as admin from 'firebase-admin';
import { UserInfo } from 'src/common/custom-type/user-info.type';

@Injectable()
export class AuthService {
  async validateUser(request: Request): Promise<LoginResultType> {
    try {
      let idToken: string | null = null;

      if (
        request.headers['Authorization'] &&
        request.headers['Authorization'].startsWith('Bearer')
      ) {
        idToken = request.headers['Authorization'].split('Bearer')[1];
      } else {
        throw new UnauthorizedException('login fail : no token');
      }

      let userInfo: UserInfo;

      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          userInfo.uid = decodedToken.uid;
          userInfo.email = decodedToken.email;
        })
        .catch(() => {
          throw new UnauthorizedException('login fail : token info error');
        });

      return null;
    } catch (err) {
      throw err;
    }
  }
}
