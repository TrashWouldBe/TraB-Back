import { Controller, Post, Req } from '@nestjs/common';
import { LoginResultType } from 'src/common/constant/login-result-type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Req() request: Request): Promise<LoginResultType> {
    const result: LoginResultType = await this.authService.validateUser(
      request,
    );
    return result;
  }
}
