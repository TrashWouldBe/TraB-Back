import { ApiProperty } from '@nestjs/swagger';
import { FAIL_LOGIN_FIREBASE } from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';

export class FailLoginFirebaseResponse {
  @ApiProperty({
    example: authErrorCode.FAIL_LOGIN_FIREBASE,
    description: FAIL_LOGIN_FIREBASE,
  })
  code: string;
  @ApiProperty({
    example: FAIL_LOGIN_FIREBASE,
  })
  message: string;
}
