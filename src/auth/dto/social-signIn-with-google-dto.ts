import { ApiProperty } from '@nestjs/swagger';

export class SocialSignInWithGoogleDTO {
  @ApiProperty({
    example: 'hsoooo2341@gmail.com',
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    example: '한승우',
    description: '사용자의 이름',
  })
  name: string;

  @ApiProperty({
    example: 'https://lh3.googleusercontent.com/a/ACg8ocJJG2Yc3y1ogPldjkcKNHZPzzBxazUYyxC6MSrdojFz=s1337',
    description: '프로필 이미지',
  })
  profileImage: string;

  @ApiProperty({
    example: '여기에_FCM_토큰을_입력',
    description: 'FCM 토큰',
  })
  fcm_token: string;
}
