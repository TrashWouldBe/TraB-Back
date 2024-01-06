import { AuthProvider } from './auth-provider.type';

export class SocialSignInBody {
  access_token: string;
  provider: AuthProvider;
  fcm_token: string;
}
