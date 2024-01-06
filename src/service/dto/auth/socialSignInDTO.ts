import { ApiProperty } from '@nestjs/swagger';
import {
  FAIL_GET_KAKAO_LOGIN_INFO,
  FAIL_LOGIN_FIREBASE,
  KAKAO_ACCOUNT_REQUIRED,
} from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';
import { AuthProvider } from 'src/common/types';

export class LoginSuccessResponseDTO {
  @ApiProperty({
    example: {
      code: 1,
      message: 'Success',
      data: {
        uid: 'Oz7yE9BRsCRArkTRrAiPJFKa1BA3',
        token:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcwNDQ4MTIzOCwiZXhwIjoxNzA0NDg0ODM4LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay0zZDh4NEB0cmFiLTkyYWZmLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstM2Q4eDRAdHJhYi05MmFmZi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6Ik96N3lFOUJSc0NSQXJrVFJyQWlQSkZLYTFCQTMifQ.X4_MHPFOVKkhR_04BPC6pX4hIGR8Np2vR71heq6zirrOgm4EFgzTG0Y_tP8n51kj_ZbaftW4h1W6VIwj-uY83hrbRPAaCWwUQ6FK-7tzDYMI4ypKX0bJ80MsAu3JPvG7sIyvSIlgzQXxULXmBsXvz-uaRLOkdCMaIdHHnLzyEf84LRlEPovRFqVNldskfCTI60axL0VCCL9_IjtCjZX29yXLkVpy3WSHgfAUgZmetbQufnczi3glJJappZecJNctPUkdRcZVMye4P6LdhmORm_tp6q4qFllMOpOI16c5NUrSCm5QGGG7gZxQq8FOw4J1uh8xkNCZzhHfiqOXgQcW3Q',
      },
    },
    description: '로그인 성공',
  })
  uid: string;
}

export class MissingKakaoAccountResponseDTO {
  @ApiProperty({
    example: {
      code: authErrorCode.MISSING_KAKAO_ACCOUNT,
      message: KAKAO_ACCOUNT_REQUIRED,
    },
    description: '카카오 계정 없음',
  })
  message: string;
}

export class FailLoginFirebaseResponseDTO {
  @ApiProperty({
    example: {
      code: authErrorCode.FAIL_LOGIN_FIREBASE,
      message: FAIL_LOGIN_FIREBASE,
    },
    description: '파이어 베이스 인증 실패',
  })
  message: string;
}

export class FailGetKakaoLoginInfoDTO {
  @ApiProperty({
    example: {
      code: authErrorCode.FAIL_GET_KAKAO_LOGIN_INFO,
      message: FAIL_GET_KAKAO_LOGIN_INFO,
    },
    description: '카카오 로그인 정보 불러오기 실패',
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
