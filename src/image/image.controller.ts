import { Controller, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post()
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
  async uploadNormalTrashImage(
    @Req() request: Request,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: string = await this.imageService.uploadNormalTrashImage(token, image);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
