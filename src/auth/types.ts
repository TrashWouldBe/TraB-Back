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

export class SocialSignInBody {
  access_token: string;
  provider: AuthProvider;
  fcm_token: string;
}
