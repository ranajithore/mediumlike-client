import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { CustomValidators } from 'src/app/custom-validators';
import { EndPoints } from 'src/end-points';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  public resetPasswordForm = this.formBuilder.group({
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
        CustomValidators.strongPassword(),
      ],
    ],
    confirmPassword: [
      '',
      [Validators.required, CustomValidators.confirmPassword('password')],
    ],
  });

  private token = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private alertService: CustomAlertService
  ) {
    this.route.params.subscribe((data) => {
      this.token = data['token'];
    });
  }

  public onResetPasswordBtnClick() {
    const formData = this.resetPasswordForm.getRawValue();
    this.authService
      .resetPassword(this.token, formData.password!)
      .subscribe(async () => {
        const result = await this.alertService.showSuccess(
          'Password Reset Successfully'
        );
        if (result.isDismissed) {
          this.router.navigateByUrl(EndPoints.SIGN_IN);
        }
      });
  }

  public onFormDataChange(ev: Event) {
    const inputElement = ev.target as HTMLElement;
    const formControl = this.resetPasswordForm.get(
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
