import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { serializeMessage } from 'src/common/utils/serialize-message';
import { SUCCESS_CODE } from 'src/common/constants/constants';
import { SerializedMessage } from 'src/common/types/serialized-message.type';
import { authErrorCode } from 'src/common/error/errorCode';
import { SocialSignInWithAppleDTO } from 'src/auth/dto/social-signIn-with-apple.dto';
import { LoginSuccessResponse } from './response/login-success.response';
import { MissingKakaoAccountResponse } from './response/missing-kakao-account.response';
import { FailGetKakaoLoginInfoResponse } from './response/fail-get-kakao-login-info.response';
import { FailLoginFirebaseResponse } from './response/fail-login-firebase.response';
import { SocialSignInDTO } from './dto/social-signin.dto';
import { FailDecodeIdTokenResponse } from './response/fail-decode-idtoken.response';
import { UserToken } from './types/user-token.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/kakao&google')
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
  @ApiResponse({
    status: authErrorCode.FAIL_GET_GOOGLE_LOGIN_INFO,
    type: FailGetKakaoLoginInfoResponse,
  })
  async socialSignInWithKakao(
    @Body() socialSignInDto: SocialSignInDTO,
  ): Promise<SerializedMessage> {
    const data: UserToken = await this.authService.socialSignIn(
      socialSignInDto,
    );
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }

  @Post('/apple')
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
    const data: UserToken = await this.authService.socialSignInWithApple(
      socialSignInWithAppleDTO,
    );
    return serializeMessage({
      code: SUCCESS_CODE,
      message: 'Success',
      data: data,
    });
  }
}
