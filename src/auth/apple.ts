import * as jwt from 'jsonwebtoken';
import { AppleUserInfo } from './types';
import { Auth } from 'firebase-admin/lib/auth/auth';
import { HttpServerError } from 'src/common/error/errorHandler';
import {
  EMAIL_ALREADY_EXISTS,
  FAIL_DECODE_ID_TOKEN,
  FAIL_LOGIN_FIREBASE,
} from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';
import { HttpStatus } from '@nestjs/common';

export const getAppleUserInfo = async (
  id_token: string,
  uid: string,
  first_name: string,
  last_name: string,
) => {
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

const registerAppleUser = async (
  appleUserInfo: AppleUserInfo,
  firebaseAuth: Auth,
) => {
  const { uid, email, name } = appleUserInfo;
  let user;
  try {
    user = await firebaseAuth.createUser({
      email,
      displayName: name,
    });
    //db에 유저정보 저장
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

export const signInWithApple = async (
  id_token: string,
  id: string,
  first_name: string,
  last_name: string,
  firebaseAuth: Auth,
) => {
  const appleUserInfo = await getAppleUserInfo(
    id_token,
    id,
    first_name,
    last_name,
  );
  return registerAppleUser(appleUserInfo, firebaseAuth);
};
