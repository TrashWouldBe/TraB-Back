import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrabService } from './trab.service';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { TrabInfoDto } from './dto/trab-info.dto';

@ApiTags('Trab')
@Controller('trab')
export class TrabController {
  constructor(private readonly trabService: TrabService) {}

  @Get()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab 정보를 가져오는 api',
  })
  @ApiResponse({
    status: 201,
    description: '성공: 처음이면 null. 아니면 trab 정보 반환',
    type: TrabInfoDto,
  })
  @ApiResponse({
    status: 406,
    description: '실패: trab 테이블 오류',
  })
  async checkIsTrab(@Req() request: Request): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data = await this.trabService.getTrab(token);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  @Post()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab를 만드는 api',
  })
  @ApiQuery({
    name: 'name',
    description: '트레비 이름',
  })
  @ApiResponse({
    status: 201,
    description: '성공: trab 정보 반환',
    type: TrabInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async createTrab(@Req() request: Request, @Query('name') name: string): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: TrabInfoDto = await this.trabService.createTrab(token, name);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
