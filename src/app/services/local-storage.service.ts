import { Injectable } from '@angular/core';
import { SignInResponse } from '../auth';
import { User } from '..';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private ACCESS_TOKEN = 'accessToken';
  private REFRESH_TOKEN = 'refreshToken';
  private CURRENT_LOGGED_IN_USER = 'currentLogedInUser';
  private REMEMBER_ME = 'rememberMe';

  constructor() {}

  public get(key: string) {
    return localStorage.getItem(key);
  }

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public setUserInfo(signInRes: SignInResponse) {
    localStorage.setItem(this.ACCESS_TOKEN, signInRes.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, signInRes.refreshToken);
  }

  public setJwtTokens(signInRes: SignInResponse) {
    localStorage.setItem(this.ACCESS_TOKEN, signInRes.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN, signInRes.refreshToken);
  }

  public setAccessToken(accessToken: string) {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  public setRefreshToken(refreshToken: string) {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  public setCurrentLoggedInUser(user: User) {
    localStorage.setItem(this.CURRENT_LOGGED_IN_USER, JSON.stringify(user));
  }

  public getCurrentLoggedInUser(): User | any {
    if (!localStorage.getItem(this.CURRENT_LOGGED_IN_USER)) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem(this.CURRENT_LOGGED_IN_USER)!);
  }

  public getRememberMeValue(): boolean {
    if (!localStorage.getItem(this.REMEMBER_ME)) {
      return false;
    }
    return JSON.parse(localStorage.getItem(this.REMEMBER_ME)!);
  }

  public setRememberMeValue(value: boolean) {
    return localStorage.setItem(this.REMEMBER_ME, JSON.stringify(value));
  }

  public clearStorage() {
    localStorage.clear();
  }
}
