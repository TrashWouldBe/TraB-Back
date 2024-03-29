import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { authErrorCode } from 'src/common/error/errorCode';
import { GetSocialSignInWithAppleDTO } from 'src/auth/dto/get-social-signIn-with-apple.dto';
import { LoginSuccessResponse } from './response/login-success.response';
import { MissingKakaoAccountResponse } from './response/missing-kakao-account.response';
import { FailLoginFirebaseResponse } from './response/fail-login-firebase.response';
import { GetSocialSignInWithKakaoDTO } from './dto/get-social-signIn-with-kakao-dto';
import { FailDecodeIdTokenResponse } from './response/fail-decode-idtoken.response';
import { UserToken } from './types/user-token.type';
import { GetSocialSignInWithGoogleDTO } from './dto/get-social-signIn-with-google-dto';
import { FailGetKakaoLoginInfoResponse } from './response/fail-get-kakao-login-info.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/socialSignInWithKakao')
  @ApiOperation({
    summary: '소셜 로그인 (카카오)',
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
    status: authErrorCode.FAIL_LOGIN_FIREBASE,
    type: FailLoginFirebaseResponse,
  })
  @ApiResponse({
    status: authErrorCode.FAIL_GET_KAKAO_LOGIN_INFO,
    type: FailGetKakaoLoginInfoResponse,
  })
  async socialSignInWithKakao(
    @Body() getSocialSignInWithKakaoDTO: GetSocialSignInWithKakaoDTO,
  ): Promise<SerializedMessage> {
    const data: UserToken = await this.authService.socialSignInWithKakao(getSocialSignInWithKakaoDTO);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  @Post('/socialSignInWithGoogle')
  @ApiOperation({
    summary: '소셜 로그인 (구글)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '로그인 성공',
    type: LoginSuccessResponse,
  })
  @ApiResponse({
    status: authErrorCode.FAIL_LOGIN_FIREBASE,
    type: FailLoginFirebaseResponse,
  })
  async socialSignInWithGoogle(
    @Body() getSocialSignInWithGoogleDTO: GetSocialSignInWithGoogleDTO,
  ): Promise<SerializedMessage> {
    const data: UserToken = await this.authService.socialSignInWithGoogle(getSocialSignInWithGoogleDTO);
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
    @Body() getSocialSignInWithAppleDTO: GetSocialSignInWithAppleDTO,
  ): Promise<SerializedMessage> {
    const data: UserToken = await this.authService.socialSignInWithApple(getSocialSignInWithAppleDTO);
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
