import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CustomAlertService } from '../services/custom-alert.service';
import { LoadingBarService } from '../services/loading-bar.service';
import { Router } from '@angular/router';
import { EndPoints } from 'src/end-points';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private alertService: CustomAlertService,
    private loadingBarService: LoadingBarService,
    private router: Router,
    private storage: LocalStorageService
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        this.loadingBarService.hideLoadingBar();
        if (
          err.status === HttpStatusCode.Unauthorized &&
          err.error &&
          !this.storage.getCurrentLoggedInUser()
        ) {
          this.alertService.showError(err.error.message);
          this.router.navigateByUrl(EndPoints.SIGN_IN);
        } else if (err.status !== HttpStatusCode.Unauthorized && err.error) {
          this.alertService.showError(err.error.message);
        } else if (err.status !== HttpStatusCode.Unauthorized) {
          this.alertService.showError(err.message);
        }
        return throwError(() => err);
      })
    );
  }
}
