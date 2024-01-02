import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RefreshAccessTokenResponse, SignInRequest, SignInResponse } from '..';
import urlJoin from 'url-join';
import { environment } from 'src/environments/environment.development';
import { EndPoints } from 'src/end-points';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { User } from 'src/app';
import { GlobalEventsService } from 'src/app/services/global-events.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private glovalEvents: GlobalEventsService
  ) {}

  public signIn(body: SignInRequest): Observable<SignInResponse> {
    const url = urlJoin(environment.serverURL, EndPoints.SIGN_IN);
    return this.http.post<SignInResponse>(url, body).pipe(
      tap((res) => {
        this.storage.setCurrentLoggedInUser(res.userInfo);
        this.storage.setJwtTokens(res);
        this.glovalEvents.userLoaded.next(true);
      })
    );
  }

  public signUp(body: SignInRequest): Observable<Object> {
    const url = urlJoin(environment.serverURL, EndPoints.SIGN_UP);
    return this.http.post(url, body);
  }

  public getAccessToken(): string | null {
    return this.storage.getAccessToken();
  }

  public getRefreshToken(): string | null {
    return this.storage.getRefreshToken();
  }

  public refreshAccessToken(): Observable<Object> {
    const url = urlJoin(environment.serverURL, EndPoints.REFRESH_ACCESS_TOKEN);
    return this.http
      .post<RefreshAccessTokenResponse>(url, {
        token: this.getRefreshToken(),
      })
      .pipe(
        tap((res) => {
          this.storage.setAccessToken(res.accessToken);
        })
      );
  }

  public changePassword(oldPassword: string, newPassword: string) {
    const url = urlJoin(environment.serverURL, EndPoints.CHANGE_PASSWORD);
    return this.http.post(url, { oldPassword, newPassword });
  }

  public sendPasswordResetEmail(email: string) {
    const url = urlJoin(
      environment.serverURL,
      EndPoints.SEND_PASSWORD_VERIFICATION_EMAIL
    );
    return this.http.post(url, { email });
  }

  public resetPassword(token: string, newPassword: string) {
    const url = urlJoin(environment.serverURL, EndPoints.RESET_PASSWORD, token);
    return this.http.post(url, { newPassword });
  }

  public logOut(isRefreshTokenExpired: boolean = false) {
    if (
      this.storage.getAccessToken() &&
      this.storage.getRefreshToken() &&
      !isRefreshTokenExpired
    ) {
      const url = urlJoin(environment.serverURL, EndPoints.LOG_OUT);
      this.http
        .post(url, {
          accessToken: this.getAccessToken(),
          refreshToken: this.getRefreshToken(),
        })
        .subscribe();
    }
    this.storage.clearStorage();
  }
}
