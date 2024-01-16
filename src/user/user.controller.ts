import {
  Controller,
  Delete,
  Get,
  Headers,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserInfoDto } from './dto/user-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
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
    status: 500,
    description: '실패: 서버 자체 오류',
  })
  async getUserInfo(
    @Headers('Authorization') idToken: string,
  ): Promise<UserInfoDto> {
    return this.userService.getUserInfo(idToken);
  }

  @Put('/delete')
  @ApiOperation({
    summary: '유저를 삭제하는 api',
  })
  async deleteUser(@Headers('Authorization') idToken: string): Promise<void> {
    return this.userService.deleteUser(idToken);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Delete('/image')
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
    description: '성공: 이미지 변경 완료',
  })
  @ApiResponse({
    status: 400,
    description: '실패',
  })
  async updateUserImage(
    @Headers('Authorization') idToken: string,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<string> {
    return this.userService.changeUserImage(idToken, image);
  }
}
