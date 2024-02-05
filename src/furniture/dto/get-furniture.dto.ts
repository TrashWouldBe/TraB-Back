import { ApiProperty } from '@nestjs/swagger';

export class GetFurnitureDto {
  @ApiProperty({
    example: 'trashCan, familyPhoto, table, lighting, potOfLuck, rug, wallpaper, flooring',
  })
  furnitureName: string;

  @ApiProperty({
    example: 2,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  glass: number | null;

  @ApiProperty({
    example: 3,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  paper: number | null;

  @ApiProperty({
    example: 5,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  can: number | null;

  @ApiProperty({
    example: 1,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  plastic: number | null;

  @ApiProperty({
    example: 7,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  vinyl: number | null;

  @ApiProperty({
    example: 9,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  styrofoam: number | null;

  @ApiProperty({
    example: 2,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  general: number | null;

  @ApiProperty({
    example: 1,
    type: 'number | null',
    default: 0, // 기본값 설정
  })
  food: number | null;
}
