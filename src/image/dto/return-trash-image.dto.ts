import { ApiProperty } from '@nestjs/swagger';

export class ReturnTrashImageDto {
  @ApiProperty({
    example: 'https://storage.googleapis.com/trab-image/user-uid/imag.png',
  })
  imageUrl: string;

  @ApiProperty({
    example: 'paper',
  })
  trashType: string;
}
