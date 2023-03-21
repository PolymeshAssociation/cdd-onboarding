import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';

const noBodyMethods = ['GET', 'OPTIONS', 'HEAD', 'TRACE', 'DELETE'];

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  /**
   * Logs request and responses
   */
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const requestId = randomUUID();
    const req: Request = context.switchToHttp().getRequest();

    const { method, url, body: reqBody } = req;

    const body = noBodyMethods.includes(method) ? undefined : reqBody;

    const message = `Request: ${method} ${url}`;

    this.logger.info(message, {
      method,
      url,
      body,
      requestId,
    });

    return next.handle().pipe(
      tap({
        next: (): void => {
          this.logResponse(context, requestId);
        },
        error: (err: Error): void => {
          this.logError(err, context, requestId);
        },
      })
    );
  }

  /**
   * Logs the request response in success cases
   *
   * @param context details about the current request
   */
  private logResponse(context: ExecutionContext, requestId: string): void {
    const { method, url } = context.switchToHttp().getRequest();
    const { statusCode, body } = context.switchToHttp().getResponse();

    const message = `Response: ${statusCode} ${method} ${url}`;

    this.logger.info(message, {
      method,
      url,
      body,
      requestId,
      statusCode,
    });
  }

  /**
   * Logs the request response in success cases
   *
   * @param error Error object
   * @param context details about the current request
   */
  private logError(
    error: Error,
    context: ExecutionContext,
    requestId: string
  ): void {
    const { method, url, body } = context.switchToHttp().getRequest();

    if (error instanceof HttpException) {
      const statusCode = error.getStatus();

      const message = `Response: ${statusCode} ${method} ${url}`;

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          message,
          {
            method,
            url,
            body,
            statusCode,
            requestId,
            error: error.message,
          },
          error.stack
        );
      } else {
        this.logger.warn(message, {
          method,
          url,
          body,
          statusCode,
          requestId,
          error: error.message,
        });
      }
    } else {
      this.logger.error(
        'Error occurred',
        {
          requestId,
          error: error.message,
        },
        error.stack
      );
    }
  }
}
