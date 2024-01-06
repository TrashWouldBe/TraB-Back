import { ApiProperty } from '@nestjs/swagger';
import {
  FAIL_GET_KAKAO_LOGIN_INFO,
  KAKAO_ACCOUNT_REQUIRED,
} from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';
import { AuthProvider } from 'src/common/types';

export class MissingKakaoAccountResponse {
  @ApiProperty({
    example: authErrorCode.MISSING_KAKAO_ACCOUNT,
    description: KAKAO_ACCOUNT_REQUIRED,
  })
  code: string;
  @ApiProperty({
    example: KAKAO_ACCOUNT_REQUIRED,
  })
  message: string;
}

export class FailGetKakaoLoginInfoResponse {
  @ApiProperty({
    example: authErrorCode.FAIL_GET_KAKAO_LOGIN_INFO,
    description: FAIL_GET_KAKAO_LOGIN_INFO,
  })
  code: string;
  @ApiProperty({
    example: KAKAO_ACCOUNT_REQUIRED,
  })
  message: string;
}

export class SocialSignInDTO {
  @ApiProperty({
    example: '0ZK6WTjgrMYdaUSSO-Utmcvr4DXHp5HIdC4KPXTbAAABjNrxylZb9Pmr5eg_ZA',
    description: '소셜 서비스에서 제공하는 액세스 토큰',
  })
  access_token: string;

  @ApiProperty({
    example: 'kakao',
    description: '소셜 서비스 제공자 (예: "kakao", "google", "facebook")',
  })
  provider: AuthProvider;

  @ApiProperty({
    example: '여기에_FCM_토큰을_입력',
    description: 'FCM 토큰',
  })
  fcm_token: string;
}
