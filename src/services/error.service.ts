import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class ErrorService {
  private readonly logger = new Logger(ErrorService.name);

  handleError(error: any): HttpException {
    this.logger.error(error);
    if (error instanceof HttpException) {
      return this.handleHttpException(error);
    }

    if (Array.isArray(error) && error[0] instanceof ValidationError) {
      return this.handleValidationError(error);
    }

    return this.handleUnknownError(error);
  }

  private handleHttpException(error: HttpException): HttpException {
    const response = error.getResponse() as any;

    if (error instanceof BadRequestException) {
      return new HttpException(
        {
          success: false,
          msg: 'Validation failed',
          errors: Array.isArray(response.message)
            ? response.message
            : [response.message],
          code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 处理嵌套的 HttpException
    if (response && typeof response === 'object' && 'success' in response) {
      return new HttpException(response, error.getStatus());
    }

    return new HttpException(
      {
        success: false,
        msg: error.message,
        code: error.getStatus(),
      },
      error.getStatus(),
    );
  }

  private handleValidationError(errors: ValidationError[]): HttpException {
    const validationErrors = this.formatValidationErrors(errors);
    return new HttpException(
      {
        success: false,
        msg: 'Validation failed',
        errors: validationErrors,
        code: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  private handleUnknownError(error: Error): HttpException {
    return new HttpException(
      {
        success: false,
        msg: 'Internal server error',
        error: error.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private formatValidationErrors(
    errors: ValidationError[],
  ): Record<string, string[]> {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);
      return acc;
    }, {});
  }
}
