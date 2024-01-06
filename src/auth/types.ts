import { AuthProvider } from 'src/common/types';

export interface KakaoUserInfo {
  id: number;
  kakao_account?: {
    name?: string;
    email?: string;
    birthyear?: string;
    gender?: string;
    phoneNumber?: string;
  };
}

export interface AppleUserInfo {
  uid: string;
  name: string;
  email: string;
  birthyear?: string;
  gender?: string;
  phone_number?: string;
}

export class SocialSignInBody {
  access_token: string;
  provider: AuthProvider;
  fcm_token: string;
}
