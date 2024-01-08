import { ApiProperty } from '@nestjs/swagger';

export class SocialSignInWithKakaoDTO {
  @ApiProperty({
    example: '0ZK6WTjgrMYdaUSSO-Utmcvr4DXHp5HIdC4KPXTbAAABjNrxylZb9Pmr5eg_ZA',
    description: '소셜 서비스에서 제공하는 액세스 토큰',
  })
  access_token: string;

  @ApiProperty({
    example: '여기에_FCM_토큰을_입력',
    description: 'FCM 토큰',
  })
  fcm_token: string;
}
