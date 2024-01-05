import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { LoginResultType } from 'src/common/constant/login-result-type';
import * as admin from 'firebase-admin';
import { UserInfo } from 'src/common/custom-type/user-info.type';

@Injectable()
export class AuthService {
  async validateUser(request: Request): Promise<string> {
    try {
      console.log(request);
      let idToken: string | null = null;
      if (
        request.headers['authorization'] &&
        request.headers['authorization'].startsWith('Bearer')
      ) {
        idToken = request.headers['authorization'].split('Bearer')[1];
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

      return userInfo.uid;
    } catch (err) {
      throw err;
    }
  }
}
