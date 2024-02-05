import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrabService } from './trab.service';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { ReturnTrabInfoDto } from './dto/return-trab-info.dto';
import { ReturnFurnitureInfoDto } from '../furniture/dto/return-furniture-info.dto';
import { ReturnSnackDto } from 'src/snack/dto/return-snack.dto';
import { GetTrabDto } from './dto/get-trab.dto';
import { GetFurnitureDto } from '../furniture/dto/get-furniture.dto';
import { SnackService } from 'src/snack/snack.service';
import { ReturnSnackImageInfoDto } from 'src/snack/dto/return-snack-image-info.dto';
import { FurnitureService } from 'src/furniture/furniture.service';

@ApiTags('Trab')
@Controller('trab')
export class TrabController {
  constructor(
    private readonly trabService: TrabService,
    private readonly snackService: SnackService,
    private readonly furnitureService: FurnitureService,
  ) {}

  // check
  @Get()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab 정보를 가져오는 api',
  })
  @ApiResponse({
    status: 201,
    description: '성공: 처음이면 null. 아니면 trab 정보 반환',
    type: ReturnTrabInfoDto,
  })
  @ApiResponse({
    status: 406,
    description: '실패: trab 테이블 오류',
  })
  async checkIsTrab(@Req() request: Request): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: ReturnTrabInfoDto | null = await this.trabService.getTrab(token);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Post()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab를 만드는 api',
  })
  @ApiBody({
    type: GetTrabDto,
  })
  @ApiQuery({
    name: 'token',
    type: 'string',
  })
  @ApiResponse({
    status: 201,
    description: '성공: trab 정보 반환',
    type: ReturnTrabInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async createTrab(@Req() request: Request, @Body() getTrabDto: GetTrabDto): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: ReturnTrabInfoDto = await this.trabService.createTrab(token, getTrabDto.name);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Patch()
  @ApiBearerAuth('id_token')
  @ApiOperation({ summary: 'trab을 수정하는 api' })
  @ApiBody({ type: GetTrabDto })
  @ApiResponse({
    status: 201,
    description: '성공: trab 정보 반환',
    type: ReturnTrabInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async patchTrab(
    @Req() request: Request,
    @Query('trab_id') trab_id: number,
    @Body() getTrabDto: GetTrabDto,
  ): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: ReturnTrabInfoDto = await this.trabService.patchTrab(token, trab_id, getTrabDto.name);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get('/furniture/list')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab의 가구 리스트를 가져오는 api',
  })
  @ApiQuery({
    name: 'trab_id',
    description: '트레비 id',
  })
  @ApiResponse({
    status: 201,
    description: '성공: furniture list 반환',
    type: ReturnFurnitureInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getFurnitureList(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: ReturnFurnitureInfoDto[] = await this.furnitureService.getFurnitureList(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get('/furniture/arranged')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '배치된 가구를 가져오는 api',
  })
  @ApiQuery({
    name: 'trab_id',
    description: '트레비 id',
  })
  @ApiResponse({
    status: 201,
    description: '성공: 배치된 가구 정보 반환',
    type: ReturnFurnitureInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getArrangedFurnitureList(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: ReturnFurnitureInfoDto[] = await this.furnitureService.getArrangedFurnitureList(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Patch('/furniture')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '가구를 만드는 api',
  })
  @ApiBody({
    type: GetFurnitureDto,
  })
  @ApiQuery({
    name: 'trab_id',
    type: 'number',
  })
  @ApiResponse({
    status: 201,
    description: '성공: 만들어진 가구 정보를 반환',
    type: ReturnFurnitureInfoDto,
  })
  @ApiResponse({
    status: 406,
    description: '실패: 가지고 있는 간식 개수 부족 / db 저장 과정에서 오류 발생',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async makeFurniture(
    @Query('trab_id') trab_id: number,
    @Body() getFurnitureDto: GetFurnitureDto,
  ): Promise<SerializedMessage> {
    const data: ReturnFurnitureInfoDto = await this.furnitureService.makeFurniture(trab_id, getFurnitureDto);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get('/snack')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab가 가진 남은 간식 가져오는 api',
  })
  @ApiQuery({
    name: 'trab_id',
    description: '트레비 id',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 간식 정보 반환',
    type: ReturnSnackDto,
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
    const data: ReturnSnackDto = await this.snackService.getSnack(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get('/totalSnack')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab가 모은 모든 간식 가져오는 api',
  })
  @ApiQuery({
    name: 'trab_id',
    description: '트레비 id',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 간식 정보 반환',
    type: ReturnSnackDto,
  })
  @ApiResponse({
    status: 404,
    description: '실패: snack entity / uid 발견 실패',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async getTotalSnack(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: ReturnSnackDto = await this.snackService.getTotalSnack(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get('/snack/trashList')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab가 가지고 있는 남은 간식 사진 가져오는 api',
  })
  @ApiQuery({
    name: 'trab_id',
    description: '트레비 id',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 간식 사진 정보 반환',
    type: ReturnSnackImageInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: '실패: snack entity / uid 발견 실패',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async getSnackImages(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: ReturnSnackImageInfoDto[] = await this.snackService.getSnackImages(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  // check
  @Get('/snack/totalTrashList')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: 'trab가 가지고 있는 모든 간식 사진 가져오는 api',
  })
  @ApiQuery({
    name: 'trab_id',
    description: '트레비 id',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 간식 사진 정보 반환',
    type: ReturnSnackImageInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: '실패: snack entity / uid 발견 실패',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async getSnackTotalImages(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: ReturnSnackImageInfoDto[] = await this.snackService.getSnackTotalImages(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
