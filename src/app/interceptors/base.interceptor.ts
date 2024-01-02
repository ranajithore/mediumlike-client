import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingBarService } from '../services/loading-bar.service';
import { map } from 'rxjs';

@Injectable()
export class BaseInterceptor implements HttpInterceptor {
  constructor(private loadingBarService: LoadingBarService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loadingBarService.showLoadingBar();
    const jsonReq = req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
    });
    return next.handle(jsonReq).pipe(
      map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse || evt instanceof Error) {
          this.loadingBarService.hideLoadingBar();
        }
        return evt;
      })
    );
  }
}
