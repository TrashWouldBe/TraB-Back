import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PloggingService } from './plogging.service';
import { PloggingInfoDto } from './dto/plogging-info.dto';
import { User } from 'src/user/entities/user.entity';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';

@ApiTags('Plogging')
@Controller('plogging')
export class PloggingController {
  constructor(private readonly ploggingService: PloggingService) {}

  @UseInterceptors(FileInterceptor('images'))
  @Post()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '[미완]플로깅 정보를 저장하는 api',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        ploggingInfo: {
          type: 'object',
          properties: {
            runDate: { type: 'string' },
            runNane: { type: 'string' },
            runRange: { type: 'number' },
            runTime: { type: 'string' },
          },
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
  async uploadPloggingTrashImage(
    @Req() request: Request,
    @UploadedFile() images: Array<Express.Multer.File>,
    @Body('ploggingInfo') ploggingInfo: PloggingInfoDto,
  ): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: User = await this.ploggingService.uploadPlogging(token, images, ploggingInfo);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
