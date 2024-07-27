import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isAuthRequest(request.url, request.method)) {
      return next.handle(request);
    }

    if (this.authService.isAccessTokenExpired()) {
      this.authService.logout();
      return throwError(
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
        })
      );
    } else {
      const accessToken = this.authService.getAccessToken();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.logout();
          }
          return throwError(error);
        })
      );
    }
  }

  private isAuthRequest(url: string, method: string): boolean {
    return (
      url.includes('/auth') ||
      (method === 'POST' && url.includes('/users')) ||
      url.includes('generate-diagnosis') ||
      url.includes('/transcript') ||
      url.includes('/hash-info') ||
      url.includes('/admin') || url.includes('/langchain/predictSickness')
    );
  }
}
