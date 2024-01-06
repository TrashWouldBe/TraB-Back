import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
// import { LoginResultType } from 'src/common/constant/login-result-type';
import { AuthService } from './auth.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import {
  FailGetKakaoLoginInfoResponse,
  MissingKakaoAccountResponse,
  SocialSignInDTO,
} from 'src/swagger/dto/auth/socialSignIn';
import { authErrorCode } from 'src/common/error/errorCode';
import {
  FailDecodeIdTokenResponse,
  FailLoginFirebaseResponse,
  LoginSuccessResponse,
} from 'src/swagger/dto/auth/common';
import { SocialSignInWithAppleDTO } from 'src/swagger/dto/auth/socialSignInWithApple';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/socialSignIn')
  @ApiOperation({
    summary: '소셜 로그인 (카카오/구글)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '로그인 성공',
    type: LoginSuccessResponse,
  })
  @ApiResponse({
    status: authErrorCode.MISSING_KAKAO_ACCOUNT,
    type: MissingKakaoAccountResponse,
  })
  @ApiResponse({
    status: authErrorCode.FAIL_GET_KAKAO_LOGIN_INFO,
    type: FailGetKakaoLoginInfoResponse,
  })
  @ApiResponse({
    status: authErrorCode.FAIL_LOGIN_FIREBASE,
    type: FailLoginFirebaseResponse,
  })
  async socialSignIn(
    @Body() socialSignInDto: SocialSignInDTO,
  ): Promise<SerializedMessage> {
    const { access_token, provider /*fcm_token*/ } = socialSignInDto;
    const data = await this.authService.socialSignInWithKakao(
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
    summary: '소셜 로그인 (애플)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '로그인 성공',
    type: LoginSuccessResponse,
  })
  @ApiResponse({
    status: authErrorCode.FAIL_DECODE_ID_TOKEN,
    type: FailDecodeIdTokenResponse,
  })
  @ApiResponse({
    status: authErrorCode.FAIL_LOGIN_FIREBASE,
    type: FailLoginFirebaseResponse,
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
