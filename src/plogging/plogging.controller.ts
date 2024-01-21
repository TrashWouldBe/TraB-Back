import { Body, Controller, Post, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PloggingService } from './plogging.service';
import { PloggingInfoDto } from './dto/plogging-info.dto';
import { User } from 'src/user/entities/user.entity';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { FilesUploadDto } from './dto/plogging-upload.dto';

@ApiTags('Plogging')
@Controller('plogging')
export class PloggingController {
  constructor(private readonly ploggingService: PloggingService) {}

  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '[미완]플로깅 정보를 저장하는 api',
  })
  @ApiConsumes('multipart/form-data')
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
    @Req() request: Request,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() filesUploadDto: FilesUploadDto,
  ): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: User = await this.ploggingService.uploadPlogging(token, images, filesUploadDto);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
