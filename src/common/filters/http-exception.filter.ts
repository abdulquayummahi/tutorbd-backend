// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// The @Catch() decorator without arguments tells NestJS to catch EVERY unhandled exception
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine if it's a known HTTP error (400, 401, 404) or a critical Server Crash (500)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // THE MAGIC: Logs the exact error and payload mismatch to your NestJS terminal!
    console.error(`\n🚨 [BACKEND ERROR] ${request.method} ${request.url}`);
    console.error(`Status Code: ${status}`);
    console.error('Details:', JSON.stringify(errorResponse, null, 2));

    // Gracefully returns a standardized error structure to the frontend (Req 9)
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorResponse,
    });
  }
}
