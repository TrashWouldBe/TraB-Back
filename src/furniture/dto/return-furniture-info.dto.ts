import { ApiProperty } from '@nestjs/swagger';

export class ReturnFurnitureInfoDto {
  @ApiProperty({
    example: 7,
  })
  furnitureId: number;

  @ApiProperty({
    example: 'trashCan, familyPhoto, table, lighting, potOfLuck, rug, wallpaper, flooring',
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
