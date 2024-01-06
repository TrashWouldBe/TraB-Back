import { ApiProperty } from '@nestjs/swagger';
import {
  FAIL_DECODE_ID_TOKEN,
  FAIL_LOGIN_FIREBASE,
} from 'src/common/error/constants';
import { authErrorCode } from 'src/common/error/errorCode';

export class LoginSuccessResponse {
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
