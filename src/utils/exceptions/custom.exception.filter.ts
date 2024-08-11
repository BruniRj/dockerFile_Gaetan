import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { format } from 'date-fns';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Error Occured !!';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.getResponse()['message']; // | { message: string };
      error = exception.getResponse()['error'];
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    this.logger.error(`[${request.method}] ${request.url}`, exception.stack);

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: format(new Date(), 'dd MMM yyyy à HH:mm'),
      path: request.url,
    });
  }
}
