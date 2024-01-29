import { ApiProperty } from '@nestjs/swagger';

export class GetUserNameAndWeightDto {
  @ApiProperty({
    example: '유저 이름',
  })
  name?: string;

  @ApiProperty({
    example: '유저 몸무게 (정수)',
  })
  weight?: number;
}
