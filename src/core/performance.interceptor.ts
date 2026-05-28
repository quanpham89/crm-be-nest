import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private logger = new Logger(PerformanceInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
     const className = context.getClass().name;
  const handlerName = context.getHandler().name;

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        try {
          if (res && res.setHeader) {
            res.setHeader('X-Response-Time', `${ms}ms`);
          }
        } catch (e) {
          // ignore header set errors
        }

        if (ms > 200) {
          this.logger.warn(
          `[${className}.${handlerName}] ${req.method} ${req.url} - ${ms}ms`
        );
        }
      }),
    );
  }
}
