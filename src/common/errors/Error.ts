import { HttpStatus } from '@nestjs/common';

export interface IError {
  internalCode?: string;
  code?: number;
  message?: string;
}
export class AppError implements IError {
  constructor(
    public internalCode: string = 'internal.server.error',
    public code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public message: string = 'Internal server error',
  ) {}
}
