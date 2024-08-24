import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../inject/response.inject';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 检测是否是 sql 错误
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const msg = exception instanceof HttpException
      ? exception.getResponse() : exception instanceof Error ? exception.message : '服务器错误';

    const errorResponse: ApiResponse<null> = {
      success: false,
      msg,
      code: status,
    };
    response
      .status(status)
      .json(errorResponse);
  }
}