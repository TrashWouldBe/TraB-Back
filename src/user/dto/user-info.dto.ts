import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    example: 'hjeongb0320@gmail.com',
  })
  user_email: string;

  @ApiProperty({
    example: 'https://storage.googleapis.com/trab-image/user-uid/imag.png',
  })
  user_image: string | null;
}
