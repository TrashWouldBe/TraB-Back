import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthProvider, UserInfo } from 'src/common/types';
import { signInWithKakao } from './kakao';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}
  async validateUser(request: Request): Promise<string> {
    try {
      let idToken: string | null = null;
      if (
        request.headers['authorization'] &&
        request.headers['authorization'].startsWith('Bearer')
      ) {
        idToken = request.headers['authorization'].split('Bearer ')[1];
      } else {
        throw new UnauthorizedException('login fail : no token');
      }

      let userInfo: UserInfo;
      this.firebaseService
        .getAuth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          userInfo = {
            uid: decodedToken.uid,
            email: decodedToken.email,
          };
        })
        .catch(() => {
          throw new UnauthorizedException('login fail : token info error');
        });
      return userInfo.uid;
    } catch (err) {
      throw err;
    }
  }

  async socialSignIn(
    accessToken: string,
    // fcmToken: string,
    provider: AuthProvider,
  ) {
    let uid, token;
    if (provider === 'kakao') {
      ({ uid, token } = await signInWithKakao(
        accessToken,
        this.firebaseService.getAuth(),
      ));
    }
    //푸시알림 사용할꺼면 fcmToken사용

    //userData DB에 저장

    return {
      uid: uid,
      token: token,
      // 필요한 다른 데이터
    };
  }
}
