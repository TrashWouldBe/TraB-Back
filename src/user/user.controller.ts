import { Controller, Delete, Get, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserInfoDto } from './dto/user-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { userErrorCode } from 'src/common/error/errorCode';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '유저 정보를 가져오는 api',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 유저 정보 반환',
    type: UserInfoDto,
  })
  @ApiResponse({
    status: 404,
    description: '실패: 유저를 찾을 수 없음',
  })
  @ApiResponse({
    status: 406,
    description: '실패: 토큰오류',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async getUserInfo(@Req() request: Request): Promise<UserInfoDto> {
    const token: string = request.headers['authorization'];
    return this.userService.getUserInfo(token);
  }

  @Get('/image')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '유저의 사진을 가져오는 api',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 유저 사진 url 반환',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 유저 사진 없음',
    type: null,
  })
  @ApiResponse({
    status: 404,
    description: '실패: 유저를 찾을 수 없음',
  })
  @ApiResponse({
    status: 406,
    description: '실패: 토큰오류',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async getUserImage(@Req() request: Request): Promise<string> {
    const token: string = request.headers['authorization'];
    return this.userService.getUserImage(token);
  }

  @Delete()
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '유저를 삭제하는 api',
  })
  @ApiResponse({
    status: 200,
    description: '성공: 유저 삭제 성공',
  })
  @ApiResponse({
    status: 406,
    description: '실패: db에서 유저 지우는 과정에서 오류',
  })
  @ApiResponse({
    status: userErrorCode.FAIL_DELETE_USER_IN_FIREBASE,
    description: '실패: firebase에서 유저 지우는 과정에서 오류',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async deleteUser(@Req() request: Request): Promise<void> {
    const token: string = request.headers['authorization'];
    return this.userService.deleteUser(token);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch('/image')
  @ApiBearerAuth('id_token')
  @ApiOperation({
    summary: '유저 이미지를 변경하는 api',
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
    description: '성공: 사진 url 반환',
  })
  @ApiResponse({
    status: 406,
    description: '실패: 디비 저장과정에서 오류',
  })
  @ApiResponse({
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async updateUserImage(@Req() request: Request, @UploadedFile() image: Express.Multer.File): Promise<string> {
    const token: string = request.headers['authorization'];
    return this.userService.changeUserImage(token, image);
  }
}
