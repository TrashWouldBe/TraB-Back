import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserInfoDto {
  @ApiProperty({
    example: '유저 이름',
  })
  name: string | null;

  @ApiProperty({
    example: '유저 몸무게',
  })
  weight: number | null;

  @ApiProperty({
    example: 'hjeongb0320@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'https://storage.googleapis.com/trab-image/user-uid/imag.png',
  })
  image: string | null;
}
