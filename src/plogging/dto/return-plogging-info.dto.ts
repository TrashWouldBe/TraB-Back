import { ApiProperty } from '@nestjs/swagger';

export class ReturnPloggingInfoDto {
  @ApiProperty({
    example: 3,
  })
  ploggingId: number;

  @ApiProperty({
    example: '달린 날짜',
  })
  runDate: string;

  @ApiProperty({
    example: '달리기 이름',
  })
  runName: string;

  @ApiProperty({
    description: '달린 거리',
    example: 7.5,
  })
  runRange: number;

  @ApiProperty({
    example: '달린 시간',
  })
  runTime: string;

  @ApiProperty({
    description: '주은 간식 수',
    example: 6,
  })
  trabSnack: number;

  @ApiProperty({
    description: '소모한 칼로리',
    example: 78,
  })
  calorie: number;
}
