import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpServerError extends HttpException {
  constructor(response: { code: number; message: string }, status: HttpStatus) {
    super(response, status);
  }
}
