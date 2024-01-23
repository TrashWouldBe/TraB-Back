import { ApiProperty } from '@nestjs/swagger';

export class ReturnFurnitureInfoDto {
  @ApiProperty({
    example: 7,
  })
  furnitureId: number;

  @ApiProperty({
    example: '가구이름',
  })
  name: string;

  @ApiProperty({
    example: true,
  })
  isArrange: boolean;

  @ApiProperty({
    example: false,
  })
  isGet: boolean;
}
