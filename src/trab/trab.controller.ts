import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrabService } from './trab.service';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { TrabInfoDto } from './dto/trab-info.dto';
import { FurnitureInfoDto } from './dto/furniture-info.dto';
import { SnackDto } from 'src/snack/dto/snack.dto';
import { CreateTrabDto } from './dto/create-trab.dto';
import { MakeFurnitureDto } from './dto/make-furniture.dto';

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
  @ApiResponse({
    status: 201,
    description: '성공: trab 정보 반환',
    type: TrabInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async createTrab(@Req() request: Request, @Body() createTrabDTO: CreateTrabDto): Promise<SerializedMessage> {
    const token: string = request.headers['authorization'];
    const data: TrabInfoDto = await this.trabService.createTrab(token, createTrabDTO.name);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

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
    type: FurnitureInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getFurnitureList(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: FurnitureInfoDto[] = await this.trabService.getFurnitureList(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  @Get('/furniture/info')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '가구의 간식 정보를 가져오는 api',
  })
  @ApiQuery({
    name: 'furniture_name',
    description: '가구 이름',
  })
  @ApiResponse({
    status: 201,
    description: '성공: furniture 간식 정보 반환',
    type: SnackDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getFurnitureInfo(@Query('furniture_name') furnitureName: string): Promise<SerializedMessage> {
    const data: SnackDto = await this.trabService.getFurnitureInfo(furnitureName);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

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
    type: FurnitureInfoDto,
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async getArrangedFurnitureList(@Query('trab_id') trabId: number): Promise<SerializedMessage> {
    const data: FurnitureInfoDto[] = await this.trabService.getArrangedFurnitureList(trabId);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  @Patch('/furniture')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '가구를 만드는 api',
  })
  @ApiBody({
    type: MakeFurnitureDto,
  })
  @ApiResponse({
    status: 201,
    description: '성공: 만들어진 가구 정보를 반환',
    type: FurnitureInfoDto,
  })
  @ApiResponse({
    status: 406,
    description: '실패: 가지고 있는 간식 개수 부족 / db 저장 과정에서 오류 발생',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 에러',
  })
  async makeFurniture(@Body() makeFurnitureDto: MakeFurnitureDto): Promise<SerializedMessage> {
    const data: FurnitureInfoDto = await this.trabService.makeFurniture(makeFurnitureDto);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
