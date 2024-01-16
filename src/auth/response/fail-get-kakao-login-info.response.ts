import { ApiProperty } from '@nestjs/swagger';
import { FAIL_GET_KAKAO_LOGIN_INFO, KAKAO_ACCOUNT_REQUIRED } from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';

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
