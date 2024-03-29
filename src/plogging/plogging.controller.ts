import { Body, Controller, Get, Post, Query, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PloggingService } from './plogging.service';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { GetPloggingInfoDto } from './dto/get-plogging-info.dto';
import { ReturnPloggingInfoDto } from './dto/return-plogging-info.dto';
import { ReturnTrashImageDto } from 'src/image/dto/return-trash-image.dto';

@ApiTags('Plogging')
@Controller('plogging')
export class PloggingController {
  constructor(private readonly ploggingService: PloggingService) {}

  // check
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '플로깅 정보를 저장하는 api',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: '성공: 이미지 업로드 성공',
    type: ReturnTrashImageDto,
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
    @Body() getPloggingInfoDto: GetPloggingInfoDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: ReturnTrashImageDto[] = await this.ploggingService.uploadPlogging(token, getPloggingInfoDto, images);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'plogging 정보를 가져오는 api',
  })
  @ApiQuery({
    name: 'plogging_id',
    description: '플로깅 id',
    type: 'number',
  })
  @ApiResponse({
    status: 201,
    description: '성공: 해당 plogging 정보 반환',
    type: ReturnPloggingInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getPloggingInfo(@Req() request: Request, @Query('plogging_id') pid: number): Promise<SerializedMessage> {
    const data: ReturnPloggingInfoDto = await this.ploggingService.getPloggingInfo(pid);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get('/list')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'plogging 리스트를 가져오는 api',
  })
  @ApiResponse({
    status: 201,
    description: '성공: plogging list 반환',
    type: ReturnPloggingInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getPloggingList(@Req() request: Request): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: ReturnPloggingInfoDto[] = await this.ploggingService.getPloggingList(token);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
