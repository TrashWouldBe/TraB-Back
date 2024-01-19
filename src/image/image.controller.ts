import { Controller, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '쓰레기 사진을 저장하는 api',
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
  @ApiQuery({
    name: 'trash-type',
    description: '쓰레기 타입 (glass / paper / can / plastic / vinyl / styrofoam / general_waste / food_waste)',
  })
  @ApiQuery({
    name: 'image-type',
    description: '이미지 타입 (normal / plogging)',
  })
  @ApiResponse({
    status: 201,
    description: '성공: 이미지 업로드 성공',
  })
  @ApiResponse({
    status: 404,
    description: '실패: 토큰에서 uid 발견 못함',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 이미지 저장 오류',
  })
  async uploadImage(
    @Req() request: Request,
    @Query('trash-type') trashType: string,
    @Query('image-type') imageType: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    const token: string = request.headers['authorization'];
    return this.imageService.uploadTrashImage(token, trashType, imageType, image);
  }
}
