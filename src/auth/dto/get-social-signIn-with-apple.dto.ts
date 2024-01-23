import { ApiProperty } from '@nestjs/swagger';

export class GetSocialSignInWithAppleDTO {
  @ApiProperty({
    example:
      'eyJraWQiOiJXNldjT0tCIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLndhbGNvbWUud2FsZ2FBcHAiLCJleHAiOjE3MDQ1OTA2ODgsImlhdCI6MTcwNDUwNDI4OCwic3ViIjoiMDAwNzIzLjRhNDU1MzE1NDNhNjRjNDg5ZGY1MmViZDAwMjVmYzI4LjA1MjgiLCJub25jZSI6ImV4YW1wbGUtbm9uY2UiLCJjX2hhc2giOiJsNmNQQzYyRlpoYzBaRXZHWUs3MUdBIiwiZW1haWwiOiJoc28yMzQxQG5hdmVyLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF1dGhfdGltZSI6MTcwNDUwNDI4OCwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.nZsk320wwk9k1K8yS6_caivHbzu-65ERZ9IBAgHw16BcH-c6g3pt_L7_krxXv8x8mn48C4PvP5d5UUCz5DoPKJlcw4iacWKa7We7ZybIXHFxR6FhCDsC6yS7qeLFt5Mu1FDR1o9aN_7jf1iIQz5Vo-ZqRjY25zECzCma902lEUqEOknG05uxEF6txT5GuSY4QVNtWrBSsMmZ88gAhdOQYqOiei70Jh4uLGwtMxs8siR2Gmws_Q0GQw_3quNRKpMvQK0O8ALOFbdHnyzm-0Rx_clzSTMGbeJFFZ08dTO9aM5lr9LWUEhwOtSZSQCJFjmOkfVrm3S1nsIL1yEA1XaeVw',
    description: '애플에서 제공하는 id_token',
  })
  id_token: string;

  @ApiProperty({
    example: '000723.4a45531543a64c489df52ebd0025fc28.0528',
    description: '애플에서 제공하는 uid',
  })
  id: string;

  @ApiProperty({
    example: '승우',
    description: '사용자의 이름',
  })
  first_name: string;

  @ApiProperty({
    example: '한',
    description: '사용자의 성',
  })
  last_name: string;

  @ApiProperty({
    example: '여기에_FCM_토큰을_입력',
    description: 'FCM 토큰',
  })
  fcm_token: string;
}
