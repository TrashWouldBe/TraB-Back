import { ApiProperty } from '@nestjs/swagger';
import {
  FAIL_GET_GOOGLE_LOGIN_INFO,
  GOOGLE_ACCOUNT_REQUIRED,
} from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';

export class FaillGetKakaoLoginInfoResponse {
  @ApiProperty({
    example: authErrorCode.FAIL_GET_GOOGLE_LOGIN_INFO,
    description: FAIL_GET_GOOGLE_LOGIN_INFO,
  })
  code: string;

  @ApiProperty({
    example: GOOGLE_ACCOUNT_REQUIRED,
  })
  message: string;
}
