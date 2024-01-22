import { ApiProperty } from '@nestjs/swagger';

export class TrabInfoDto {
  @ApiProperty({
    example: 7,
  })
  trabId: number;

  @ApiProperty({
    example: '우하하',
  })
  trabName: string;

  @ApiProperty({
    example: 13,
  })
  snackCnt: number;
}
