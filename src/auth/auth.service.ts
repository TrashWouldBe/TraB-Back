import * as jwt from 'jsonwebtoken';
import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { KakaoUserInfo } from './types/kakao-userinfo.type';
import axios from 'axios';
import { HttpServerError } from 'src/common/error/errorHandler';
import { authErrorCode } from 'src/common/error/errorCode';
import {
  EMAIL_ALREADY_EXISTS,
  FAIL_DECODE_ID_TOKEN,
  FAIL_GET_KAKAO_LOGIN_INFO,
  FAIL_LOGIN_FIREBASE,
  KAKAO_ACCOUNT_REQUIRED,
} from 'src/common/error/constants';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { AppleUserInfo } from './types/apple-userinfo.type';
import { GetSocialSignInWithAppleDTO } from './dto/get-social-signIn-with-apple.dto';
import { UserToken } from './types/user-token.type';
import { GetSocialSignInWithKakaoDTO } from './dto/get-social-signIn-with-kakao-dto';
import { GoogleUserInfo } from './types/google-userinfo.type';
import { GetSocialSignInWithGoogleDTO } from './dto/get-social-signIn-with-google-dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  getKakaoUserInfo = async (accessToken: string) => {
    try {
      const { data }: { data: KakaoUserInfo } = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });
      return data;
    } catch (e) {
      throw new HttpServerError(
        {
          code: authErrorCode.FAIL_GET_KAKAO_LOGIN_INFO,
          message: FAIL_GET_KAKAO_LOGIN_INFO,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  registerKakaoUser = async (kakaoUserInfo: KakaoUserInfo, firebaseAuth: Auth) => {
    if (!kakaoUserInfo.kakao_account) {
      throw new HttpServerError(
        {
          code: authErrorCode.MISSING_KAKAO_ACCOUNT,
          message: KAKAO_ACCOUNT_REQUIRED,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let { name, email } = kakaoUserInfo.kakao_account || {};
    if (!name) name = kakaoUserInfo.id.toString();
    if (!email) email = `${kakaoUserInfo.id}@gmail.com`;

    //이미 firebaseauth 서버에 user가 있으면 create하지 않음
    try {
      const user = await firebaseAuth.createUser({
        email,
        displayName: name,
      });

      this.userService.createUser(user.uid, email, null);

      return {
        uid: user.uid,
        token: await firebaseAuth.createCustomToken(user.uid),
      };
    } catch (error: any) {
      if (error.errorInfo.code === EMAIL_ALREADY_EXISTS) {
        const existingUser = await firebaseAuth.getUserByEmail(email);
        return {
          uid: existingUser.uid,
          token: await firebaseAuth.createCustomToken(existingUser.uid),
        };
      } else {
        throw new HttpServerError(
          {
            code: authErrorCode.FAIL_LOGIN_FIREBASE,
            message: FAIL_LOGIN_FIREBASE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  };

  signInWithKakao = async (accessToken: string, firebaseAuth: Auth) => {
    const kakaoUserInfo = await this.getKakaoUserInfo(accessToken);

    return this.registerKakaoUser(kakaoUserInfo, firebaseAuth);
  };

  registerGoogleUser = async (googleUserInfo: GoogleUserInfo, firebaseAuth: Auth) => {
    const { email, name, profileImage } = googleUserInfo;
    try {
      const user = await firebaseAuth.createUser({
        email,
        displayName: name,
        photoURL: profileImage,
      });

      await this.userService.createUser(user.uid, email, profileImage);

      return {
        uid: user.uid,
        token: await firebaseAuth.createCustomToken(user.uid),
      };
    } catch (error: any) {
      if (error.errorInfo.code === EMAIL_ALREADY_EXISTS) {
        const existingUser = await firebaseAuth.getUserByEmail(email);
        return {
          uid: existingUser.uid,
          token: await firebaseAuth.createCustomToken(existingUser.uid),
        };
      } else {
        throw new HttpServerError(
          {
            code: authErrorCode.FAIL_LOGIN_FIREBASE,
            message: FAIL_LOGIN_FIREBASE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  };

  getAppleUserInfo = async (id_token: string, uid: string, first_name: string, last_name: string) => {
    const idTokenDecoded = jwt.decode(id_token);

    if (!idTokenDecoded || typeof idTokenDecoded !== 'object') {
      throw new HttpServerError(
        {
          code: authErrorCode.FAIL_DECODE_ID_TOKEN,
          message: FAIL_DECODE_ID_TOKEN,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const email = idTokenDecoded.email ? idTokenDecoded.email : '';
    const appleUserInfo: AppleUserInfo = {
      uid: uid,
      name: first_name + last_name,
      email: email,
    };

    return appleUserInfo;
  };

  registerAppleUser = async (appleUserInfo: AppleUserInfo, firebaseAuth: Auth) => {
    const { uid, email, name } = appleUserInfo;
    let user;
    try {
      user = await firebaseAuth.createUser({
        email,
        displayName: name,
      });

      this.userService.createUser(user.uid, email, null);

      return {
        uid: user.uid,
        token: await firebaseAuth.createCustomToken(user.uid),
      };
    } catch (error: any) {
      if (error.errorInfo.code === EMAIL_ALREADY_EXISTS) {
        const existingUser = await firebaseAuth.getUserByEmail(email);
        return {
          uid: existingUser.uid,
          token: await firebaseAuth.createCustomToken(existingUser.uid),
        };
      } else {
        throw new HttpServerError(
          {
            code: authErrorCode.FAIL_LOGIN_FIREBASE,
            message: FAIL_LOGIN_FIREBASE,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  };

  signInWithApple = async (id_token: string, id: string, first_name: string, last_name: string, firebaseAuth: Auth) => {
    const appleUserInfo = await this.getAppleUserInfo(id_token, id, first_name, last_name);
    return this.registerAppleUser(appleUserInfo, firebaseAuth);
  };

  async socialSignInWithKakao(getSocialSignInWithKakaoDTO: GetSocialSignInWithKakaoDTO): Promise<UserToken> {
    const { access_token /*fcm_token*/ } = getSocialSignInWithKakaoDTO;

    const userToken: UserToken = await this.signInWithKakao(access_token, this.firebaseService.getAuth());

    //푸시알림 사용할꺼면 fcmToken사용 및 db저장

    return userToken;
  }

  async socialSignInWithGoogle(getSocialSignInWithGoogle: GetSocialSignInWithGoogleDTO): Promise<UserToken> {
    const { name, profileImage, email, fcm_token } = getSocialSignInWithGoogle;
    const userToken: UserToken = await this.registerGoogleUser(
      {
        email,
        name,
        profileImage,
      },
      this.firebaseService.getAuth(),
    );
    //푸시알림 사용할꺼면 fcmToken사용 및 db저장
    return userToken;
  }

  async socialSignInWithApple(getSocialSignInWithAppleDTO: GetSocialSignInWithAppleDTO): Promise<UserToken> {
    const { id_token, id, first_name, last_name, fcm_token } = getSocialSignInWithAppleDTO;

    const { uid, token } = await this.signInWithApple(
      id_token,
      id,
      first_name,
      last_name,
      this.firebaseService.getAuth(),
    );
    //푸시알림 사용할꺼면 fcmToken사용 및 db저장

    const userToken: UserToken = {
      uid,
      token,
    };

    return userToken;
  }
}
