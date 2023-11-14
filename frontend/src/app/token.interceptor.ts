import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((refreshError:any) => {
        const errorResponse = refreshError?.error || {};
        const errorMessage = errorResponse.messages?.[0]?.message || 'Unknown error occurred';
        if (errorMessage ==="Token is invalid or expired") {
          return this.handleTokenRefreshAndRetry(request, next);
        } else {
          return throwError(() => errorMessage);
        }
      })
    );
  }

  private handleTokenRefreshAndRetry(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap((response) => {
        return next.handle(request);
      }),
      catchError((error:HttpErrorResponse) => {
        if (error.status === 401) {
          //this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

}
