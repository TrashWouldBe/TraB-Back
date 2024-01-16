import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  @ApiOperation({
    summary: '이미지 업로드 테스트 api',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '성공: 이미지가 업로드 되었습니다',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return this.imageService.uploadImage(image, 'test', null);
  }
}
