import { ApiProperty } from '@nestjs/swagger';

export class GetTrabDto {
  @ApiProperty({
    example: 'trab',
    description: '이름',
  })
  name: string;
}
