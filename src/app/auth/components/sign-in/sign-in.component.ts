import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/custom-validators';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { SignInResponse } from '../..';
import urlJoin from 'url-join';
import { environment } from 'src/environments/environment.development';
import { EndPoints } from 'src/end-points';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  public signInForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [true],
  });

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private authService: AuthService,
    private firebaseAuthService: FirebaseAuthService,
    private alertService: CustomAlertService,
    private router: Router,
    private storage: LocalStorageService
  ) {
    if (this.storage.getRememberMeValue()) {
      this.router.navigateByUrl(EndPoints.DASHBOARD);
    }
  }

  public onSignIn(ev: Event) {
    ev.preventDefault();
    const formData = this.signInForm.getRawValue();
    this.authService.signIn(formData).subscribe((data) => {
      this.alertService.showSuccess('Signed in successfully');
      this.storage.setRememberMeValue(formData.rememberMe ? true : false);
      if (data.isEmailVerificationRequired) {
        this.router.navigateByUrl('auth/verifyemail');
      } else {
        this.router.navigateByUrl(EndPoints.DASHBOARD);
      }
    });
  }

  public socialSignIn() {
    this.firebaseAuthService.signInWithGoogle();
  }

  public onFormDataChange(ev: Event) {
    const inputElement = ev.target as HTMLElement;
    const formControl = this.signInForm.get(
      inputElement.getAttribute('formControlName')!
    );
    this.renderer.removeClass(inputElement, 'is-valid');
    this.renderer.removeClass(inputElement, 'is-invalid');
    this.renderer.addClass(
      inputElement,
      formControl?.valid ? 'is-valid' : 'is-invalid'
    );
  }
}
