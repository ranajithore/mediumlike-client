import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EndPoints } from 'src/end-points';
import { environment } from 'src/environments/environment.development';
import urlJoin from 'url-join';
import { SignInResponse } from '..';
import { GlobalEventsService } from 'src/app/services/global-events.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(
    private firebaseAuth: Auth,
    private http: HttpClient,
    private alertService: CustomAlertService,
    private router: Router,
    private storage: LocalStorageService,
    private glovalEvents: GlobalEventsService
  ) {}

  public async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.firebaseAuth, provider);
    const idToken = await result.user.getIdToken();
    this.http
      .post<SignInResponse>(
        urlJoin(environment.serverURL, EndPoints.SOCIAL_SIGN_IN),
        {
          idToken: idToken,
        }
      )
      .subscribe((res) => {
        this.storage.setRememberMeValue(true);
        this.storage.setCurrentLoggedInUser(res.userInfo);
        this.storage.setJwtTokens(res);
        this.glovalEvents.userLoaded.next(true);
        this.alertService.showSuccess('Signed in successfully');
        if (res.isEmailVerificationRequired) {
          this.router.navigateByUrl(EndPoints.VERIFY_EMAIL);
        } else {
          this.router.navigateByUrl(EndPoints.DASHBOARD);
        }
      });
  }
}
