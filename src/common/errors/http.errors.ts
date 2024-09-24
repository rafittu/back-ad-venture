import { HttpStatus } from '@nestjs/common';
import { AppError } from './Error';

export class CardOperationsHttpError extends AppError {
  constructor(
    public internalCode: string = 'internal.http.error',
    public code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public message: string = 'Internal server error',
  ) {
    super(internalCode, code, message);
  }
}

export const cardOperationsHttpError = {
  INTERNAL_ERROR: new CardOperationsHttpError(),
};
