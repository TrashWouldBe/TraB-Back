import { ApiProperty } from '@nestjs/swagger';

export class GetPloggingInfoDto {
  @ApiProperty({ type: 'string', description: '운행 날짜' })
  runDate: string;

  @ApiProperty({ type: 'string', description: '운행 이름' })
  runName: string;

  @ApiProperty({ type: 'number', description: '운행 범위' })
  runRange: number;

  @ApiProperty({ type: 'string', description: '운행 시간' })
  runTime: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: Array<Express.Multer.File>;
}
