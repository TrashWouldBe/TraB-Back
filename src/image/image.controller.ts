import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  @ApiOperation({
    summary: 'imageUpload api',
  })
  async uploadImage(@UploadedFile() image: Express.Multer.File): Promise<void> {
    return this.imageService.uploadImage(image);
  }
}
