import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { CustomAlertService } from '../services/custom-alert.service';
import { Router } from '@angular/router';
import { EndPoints } from 'src/end-points';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private accessToken = new BehaviorSubject(null);
  private isUnauthorized = false;
  private unAuthorizedAttempts = 0;

  constructor(
    private authService: AuthService,
    private alertService: CustomAlertService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      req = this.addAccessTokenToHeader(req, accessToken);
    }
    return next.handle(req).pipe(
      catchError((err) => {
        if (
          this.isUnauthorized &&
          this.unAuthorizedAttempts > 2 &&
          err instanceof HttpErrorResponse &&
          err.status === HttpStatusCode.Unauthorized
        ) {
          this.showErrorAlertAndNavigate(err);
        }
        if (
          err instanceof HttpErrorResponse &&
          err.status === HttpStatusCode.Unauthorized
        ) {
          this.isUnauthorized = true;
          this.unAuthorizedAttempts++;
          return this.handleUnauthorizedAccess(req, next);
        }
        return throwError(() => new Error(err));
      })
    );
  }

  private async showErrorAlertAndNavigate(err: any) {
    if (this.isUnauthorized && err.status === HttpStatusCode.Unauthorized) {
      this.authService.logOut(true);
      const result = await this.alertService.showError(err.error.message);
      if (result.isDismissed) {
        this.router.navigateByUrl(EndPoints.SIGN_IN);
      }
    }
  }

  private addAccessTokenToHeader(req: HttpRequest<any>, token: string) {
    const authToken = `Bearer ${token}`;
    return req.clone({
      headers: req.headers.set('Authorization', authToken),
    });
  }

  private handleUnauthorizedAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.accessToken.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((res: any) => {
          this.isRefreshing = false;
          this.isUnauthorized = false;
          this.unAuthorizedAttempts = 0;
          this.accessToken.next(res.accessToken);
          return next.handle(
            this.addAccessTokenToHeader(request, res.accessToken)
          );
        })
      );
    }

    return this.accessToken.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) => {
        return next.handle(this.addAccessTokenToHeader(request, token!));
      })
    );
  }
}
