import {ExceptionFilter,Catch,ArgumentsHost,HttpException,Logger,} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    this.logger.error(`Error occurred: ${message}`, exception);

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}