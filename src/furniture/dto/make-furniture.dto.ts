import { ApiProperty } from '@nestjs/swagger';

export class MakeFurnitureDto {
  @ApiProperty({
    example: 5,
  })
  trabId: number;

  @ApiProperty({
    example: '가구이름0 ~ 가구이름9',
  })
  furnitureName: string;
}
