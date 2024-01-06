import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
// import { LoginResultType } from 'src/common/constant/login-result-type';
import { AuthService } from './auth.service';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { serializeMessage } from 'src/common/utils';
import { SUCCESS_CODE } from 'src/common/constants';
import { SerializedMessage } from 'src/common/types';
import {
  FailGetKakaoLoginInfoDTO,
  FailLoginFirebaseResponseDTO,
  LoginSuccessResponseDTO,
  MissingKakaoAccountResponseDTO,
  SocialSignInDTO,
} from 'src/service/dto/auth/socialSignInDTO';
import {
  FAIL_DECODE_ID_TOKEN,
  FAIL_GET_KAKAO_LOGIN_INFO,
  FAIL_LOGIN_FIREBASE,
  KAKAO_ACCOUNT_REQUIRED,
} from 'src/common/error/constants';
import { SocialSignInWithAppleDTO } from 'src/service/dto/auth/socialSignInWithAppleDTO';
import { FailDecodeIdToken } from 'src/service/dto/auth/common';

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
  @Post('/socialSignIn')
  @ApiOperation({
    summary: '소셜 로그인 (카카오/구글)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '로그인 성공',
    type: LoginSuccessResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: KAKAO_ACCOUNT_REQUIRED,
    type: MissingKakaoAccountResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: FAIL_LOGIN_FIREBASE,
    type: FailLoginFirebaseResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: FAIL_GET_KAKAO_LOGIN_INFO,
    type: FailGetKakaoLoginInfoDTO,
  })
  async socialSignIn(
    @Body() socialSignInDto: SocialSignInDTO,
  ): Promise<SerializedMessage> {
    const { access_token, provider /*fcm_token*/ } = socialSignInDto;
    const data = await this.authService.socialSignIn(
      access_token,
      // fcm_token,
      provider,
    );
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
  @Post('/socialSignInWithApple')
  @ApiOperation({
    summary: '소셜 로그인 (카카오/구글)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '로그인 성공',
    type: LoginSuccessResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: FAIL_LOGIN_FIREBASE,
    type: FailLoginFirebaseResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: FAIL_DECODE_ID_TOKEN,
    type: FailDecodeIdToken,
  })
  async socialSignInWithApple(
    @Body() socialSignInWithAppleDTO: SocialSignInWithAppleDTO,
  ): Promise<SerializedMessage> {
    const { id_token, id, first_name, last_name, fcm_token } =
      socialSignInWithAppleDTO;
    const data = await this.authService.socialSignInWithApple(
      id_token,
      id,
      first_name,
      last_name,
      // fcm_token,
    );
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
