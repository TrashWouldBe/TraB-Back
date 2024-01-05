import { Controller, Post, Req } from '@nestjs/common';
// import { LoginResultType } from 'src/common/constant/login-result-type';
import { AuthService } from './auth.service';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: '로그인 API',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰을 여기에 추가',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description:
      '성공: 현재는 제대로 되는지 확인하기 위해 uid를 반환하게 설정했음',
  })
  @ApiResponse({
    status: 401,
    description:
      '실패: 로그인 실패 - no token이라면 토큰 파싱 과정에서 문제, token info error라면 token은 읽었는데 인증관련 문제',
  })
  async login(@Req() request: Request): Promise<string> {
    const result: string = await this.authService.validateUser(request);
    return result;
  }
}
