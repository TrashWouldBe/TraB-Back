import { ApiProperty } from '@nestjs/swagger';

export class ReturnSnackDto {
  @ApiProperty({
    example: 2,
  })
  glass: number;

  @ApiProperty({
    example: 3,
  })
  paper: number;

  @ApiProperty({
    example: 5,
  })
  can: number;

  @ApiProperty({
    example: 1,
  })
  plastic: number;

  @ApiProperty({
    example: 7,
  })
  vinyl: number;

  @ApiProperty({
    example: 9,
  })
  styrofoam: number;

  @ApiProperty({
    example: 2,
  })
  general_waste: number;

  @ApiProperty({
    example: 1,
  })
  food_waste: number;
}
