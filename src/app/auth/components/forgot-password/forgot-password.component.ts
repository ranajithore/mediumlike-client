import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EndPoints } from 'src/end-points';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  public forgotPasswordForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
  });
  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) {}

  public onClickSendEmailBtn() {
    this.authService
      .sendPasswordResetEmail(this.forgotPasswordForm.getRawValue().email!)
      .subscribe(() => {
        this.router.navigateByUrl(EndPoints.VERIFY_EMAIL, {
          state: { isPasswordResetEmail: true },
        });
      });
  }

  public onFormDataChange(ev: Event) {
    const inputElement = ev.target as HTMLElement;
    const formControl = this.forgotPasswordForm.get(
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
