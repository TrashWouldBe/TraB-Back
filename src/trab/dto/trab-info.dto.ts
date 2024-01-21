import { ApiProperty } from '@nestjs/swagger';

export class TrabInfoDto {
  @ApiProperty({
    example: '우하하',
  })
  trab_name: string;

  @ApiProperty({
    example: 13,
  })
  snack_cnt: number;
}
