import { Controller, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post('/normal/upload')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '[일반 촬영]쓰레기 사진을 저장하는 api',
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
    // @Query('token') token: string,
    @Query('trash-type') trashType: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    const token: string = request.headers['authorization'];
    return this.imageService.uploadNormalTrashImage(token, trashType, image);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('/plogging/upload')
  // @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '[플로깅 촬영]쓰레기 사진을 저장하는 api',
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
    name: 'plogging-id',
    description: '플로깅 id',
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
  async uploadPloggingTrashImage(
    // @Req() request: Request,
    @Query('token') token: string,
    @Query('trash-type') trashType: string,
    @Query('plogging-id') ploggingId: number,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    // const token: string = request.headers['authorization'];
    return this.imageService.uploadPloggingTrashImage(token, trashType, ploggingId, image);
  }
}
