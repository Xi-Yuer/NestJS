import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorService } from '../services/error.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorService: ErrorService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpException = this.errorService.handleError(exception as Error | HttpException);
    
    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }
}