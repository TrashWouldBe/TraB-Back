import { ApiProperty } from '@nestjs/swagger';

export class ReturnSnackImageInfoDto {
  @ApiProperty({
    example: 'https://storage.googleapis.com/${this.bucket.name}/${imagePath}?timestamp=${Date.now()}',
  })
  imageUrl: string;

  @ApiProperty({
    example: 'glass',
  })
  trashType: string;
}
