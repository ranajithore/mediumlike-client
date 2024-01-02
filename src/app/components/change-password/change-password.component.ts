import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomValidators } from 'src/app/custom-validators';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { EndPoints } from 'src/end-points';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  public changePasswordForm = this.formBuilder.group({
    oldPassword: ['', [Validators.required]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
        CustomValidators.strongPassword(),
      ],
    ],
    confirmNewPassword: [
      '',
      [Validators.required, CustomValidators.confirmPassword('newPassword')],
    ],
  });
  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private authService: AuthService,
    private alertService: CustomAlertService,
    private router: Router
  ) {}

  public onChangePasswordBtnClick(ev: Event) {
    ev.preventDefault();
    const formData = this.changePasswordForm.getRawValue();
    this.authService
      .changePassword(formData.oldPassword!, formData.newPassword!)
      .subscribe(async () => {
        const result = await this.alertService.showSuccessModal(
          'Your password has been changed successfully',
          'You will be automatically redirected to signin page'
        );
        this.authService.logOut();
        if (result.isConfirmed || result.isDismissed || result.isDenied) {
          this.router.navigateByUrl(EndPoints.SIGN_IN);
        }
      });
  }

  public onFormDataChange(ev: Event) {
    const inputElement = ev.target as HTMLElement;
    const formControl = this.changePasswordForm.get(
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
