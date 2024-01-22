import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SnackService } from './snack.service';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SnackDto } from './dto/snack.dto';

@ApiTags('Snack')
@Controller('snack')
export class SnackController {
  constructor(private readonly snackService: SnackService) {}

  @Get()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab가 가지고 있는 간식 가져오는 api',
  })
  @ApiQuery({
    name: 'trab_id',
    description: '트레비 id',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 간식 정보 반환',
    type: SnackDto,
  })
  @ApiResponse({
    status: 404,
    description: '실패: snack entity / uid 발견 실패',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async getSnack(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: SnackDto = await this.snackService.getSnack(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
