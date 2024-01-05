import { HttpStatus } from '@nestjs/common';
import { KakaoUserInfo } from './types';
import axios from 'axios';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { authErrorCode } from 'src/common/error/errorCode';
import { HttpServerError } from 'src/common/error/errorHandler';
import {
  EMAIL_ALREADY_EXISTS,
  FAIL_GET_KAKAO_LOGIN_INFO,
  FAIL_LOGIN_FIREBASE,
  KAKAO_ACCOUNT_REQUIRED,
} from 'src/common/error/constants';

const getKakaoUserInfo = async (accessToken: string) => {
  try {
    const { data }: { data: KakaoUserInfo } = await axios.get(
      'https://kapi.kakao.com/v2/user/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );
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

const registerKakaoUser = async (
  kakaoUserInfo: KakaoUserInfo,
  firebaseAuth: Auth,
) => {
  if (!kakaoUserInfo.kakao_account) {
    throw new HttpServerError(
      {
        code: authErrorCode.MISSING_KAKAO_ACCOUNT,
        message: KAKAO_ACCOUNT_REQUIRED,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
  let { name, email, birthyear, phoneNumber } =
    kakaoUserInfo.kakao_account || {};
  if (!name) name = kakaoUserInfo.id.toString();
  if (!email) email = `${kakaoUserInfo.id}@gmail.com`;
  if (!birthyear) birthyear = '2000';
  if (!phoneNumber)
    phoneNumber = `+82 10-999-${Math.floor(Math.random() * 9999.9)
      .toString()
      .padStart(4, '0')}`;

  //이미 firebaseauth 서버에 user가 있으면 create하지 않음
  try {
    const user = await firebaseAuth.createUser({
      email,
      displayName: name,
      phoneNumber,
    });

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

export const signInWithKakao = async (
  accessToken: string,
  firebaseAuth: Auth,
) => {
  const kakaoUserInfo = await getKakaoUserInfo(accessToken);

  return registerKakaoUser(kakaoUserInfo, firebaseAuth);
};
