import { Controller, Get, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserInfoDto } from './dto/user-info.dto';

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
}
