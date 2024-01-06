import { ApiProperty } from '@nestjs/swagger';
import { KAKAO_ACCOUNT_REQUIRED } from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';

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
