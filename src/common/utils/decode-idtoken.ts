import { NotFoundException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const decodeToken = async (idToken: string): Promise<string> => {
  try {
    const bearerIdToken: string = idToken.substring(7);
    const decodedIdToken: any = jwt.decode(bearerIdToken);

    let uid: string = decodedIdToken.user_id;

    if (!uid) {
      uid = decodedIdToken.uid;
    }

    if (!uid) {
      throw new NotFoundException('Token에서 uid를 발견하지 못했습니다.');
    }

    return uid;
  } catch (error) {
    throw error;
  }
};
