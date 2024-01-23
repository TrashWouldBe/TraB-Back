import { Body, Controller, Get, Post, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PloggingService } from './plogging.service';
import { PloggingInfoDto } from './dto/plogging-info.dto';
import { User } from 'src/user/entities/user.entity';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { FilesUploadDto } from './dto/plogging-upload.dto';
import { get } from 'http';

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
    description: '실패: 토큰에서 uid 발견 못함ㅋㅋ',
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

  // @Get('/plogginginfo')
  // @ApiBearerAuth('id_token')
  // @ApiOperation({
  //   summary: 'plogging id 로 plogging 정보를 가져오는 api',
  // })
  // @ApiQuery({
  //   name: 'uid',
  //   description: 'user id',
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: '성공: my plogging list 반환',
  //   type: PloggingInfoDto,
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: '실패: 서버 자체 에러',
  // })
  // async getPloggingInfo(@Req() request: Request): Promise<SerializedMessage> {
  //   const token: string = request.headers['authorization'];
  //   const fid: 
  //   const data: PloggingInfoDto[] = await this.ploggingService.getPloggingInfo(token,fid);
  //   return serializeMessage({
  //     code: SUCCESS_CODE,
  //     message: 'Success',
  //     data: data,
  //   });
  // }

  @Get('/plogging/myplogginglist')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'user 본인의 plogging 리스트를 가져오는 api',
  })
  @ApiQuery({
    name: 'uid',
    description: 'user id',
  })
  @ApiResponse({
    status: 201,
    description: '성공: my plogging list 반환',
    type: PloggingInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getMyPloggingList(@Req() request: Request): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: PloggingInfoDto[] = await this.ploggingService.getMyPloggingList(token);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
