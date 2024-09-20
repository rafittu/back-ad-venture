import { AppError } from '../../common/errors/Error';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let error = new AppError();

    if (exception instanceof BadRequestException) {
      const hold = (exception.getResponse() as any) || {};
      const message = hold?.message || exception.message;
      error = new AppError('bad.request', HttpStatus.BAD_REQUEST, message);
    } else if (exception instanceof AppError) {
      error = exception;
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse() as string | object;
      error = new AppError(
        'http.error',
        status,
        typeof message === 'string' ? message : JSON.stringify(message),
      );
    }

    response.status(error.code).json({
      error: {
        message: error.message,
        code: error.internalCode,
        status: true,
      },
      data: {},
    });
  }
}
