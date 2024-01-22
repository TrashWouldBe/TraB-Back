import { ApiProperty } from '@nestjs/swagger';

export class CreateTrabDto {
  @ApiProperty({
    example: 'trab',
    description: '이름',
  })
  name: string;
}
