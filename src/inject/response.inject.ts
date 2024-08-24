import { HttpStatus, Injectable } from '@nestjs/common';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  msg?: string | object;
  code?: number;
}

@Injectable()
export class ResponseService {
  createSuccessResponse<T>(data: T = null, msg = 'success'): ApiResponse<T> {
    return { success: true, data, msg, code: HttpStatus.OK };
  }

  createErrorResponse(message: string): ApiResponse<null> {
    return { success: false, msg: message, code: HttpStatus.BAD_REQUEST };
  }
}