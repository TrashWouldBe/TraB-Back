import { ApiProperty } from '@nestjs/swagger';
import { FAIL_DECODE_ID_TOKEN } from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';

export class FailDecodeIdTokenResponse {
  @ApiProperty({
    example: authErrorCode.FAIL_DECODE_ID_TOKEN,
    description: FAIL_DECODE_ID_TOKEN,
  })
  code: string;
  @ApiProperty({
    example: FAIL_DECODE_ID_TOKEN,
  })
  message: string;
}
