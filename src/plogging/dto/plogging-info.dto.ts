import { ApiProperty } from '@nestjs/swagger';

export class PloggingInfoDto {
  @ApiProperty({
    description: '플로깅 한 날짜',
  })
  runDate: string;

  @ApiProperty({
    description: '플로깅 이름',
  })
  runName: string;

  @ApiProperty({
    description: '달리기 거리',
  })
  runRange: number;

  @ApiProperty({
    description: '달린 시간',
  })
  runTime: string;
}
