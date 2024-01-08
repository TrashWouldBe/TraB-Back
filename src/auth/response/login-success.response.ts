import { ApiProperty } from '@nestjs/swagger';
import { UserToken } from '../types/user-token.type';

export class LoginSuccessResponse {
  @ApiProperty({
    example: 1,
  })
  code: number;
  @ApiProperty({
    example: 'Success',
  })
  message: string;
  @ApiProperty({
    example: {
      uid: 'Oz7yE9BRsCRArkTRrAiPJFKa1BA3',
      token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcwNDQ4MTIzOCwiZXhwIjoxNzA0NDg0ODM4LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay0zZDh4NEB0cmFiLTkyYWZmLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstM2Q4eDRAdHJhYi05MmFmZi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6Ik96N3lFOUJSc0NSQXJrVFJyQWlQSkZLYTFCQTMifQ.X4_MHPFOVKkhR_04BPC6pX4hIGR8Np2vR71heq6zirrOgm4EFgzTG0Y_tP8n51kj_ZbaftW4h1W6VIwj-uY83hrbRPAaCWwUQ6FK-7tzDYMI4ypKX0bJ80MsAu3JPvG7sIyvSIlgzQXxULXmBsXvz-uaRLOkdCMaIdHHnLzyEf84LRlEPovRFqVNldskfCTI60axL0VCCL9_IjtCjZX29yXLkVpy3WSHgfAUgZmetbQufnczi3glJJappZecJNctPUkdRcZVMye4P6LdhmORm_tp6q4qFllMOpOI16c5NUrSCm5QGGG7gZxQq8FOw4J1uh8xkNCZzhHfiqOXgQcW3Q',
    },
  })
  data: UserToken;
}
