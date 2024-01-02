import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/custom-validators';
import validator from 'validator';
import { AuthService } from '../../services/auth.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import Swal from 'sweetalert2';
import urlJoin from 'url-join';
import { environment } from 'src/environments/environment.development';
import { EndPoints } from 'src/end-points';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements AfterViewInit {
  public signUpForm = this.formBuilder.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    email: ['', [Validators.required, Validators.email]],
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

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private authService: AuthService,
    private alertService: CustomAlertService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const passwordControl = this.signUpForm.get('password');
    const confirmPasswordControl = this.signUpForm.get('confirmPassword');

    // Confirm password should be disabled by default
    confirmPasswordControl?.disable();

    // Enable confirm password only if password is valid
    passwordControl?.statusChanges.subscribe((_) => {
      if (passwordControl.valid) {
        confirmPasswordControl?.enable();
      }
      if (passwordControl.invalid) {
        confirmPasswordControl?.disable();
      }
    });

    // If password changes then make confirm password empty
    passwordControl?.valueChanges.subscribe((data) => {
      confirmPasswordControl?.setValue('');
    });
  }

  public onSignIn(ev: Event) {
    ev.preventDefault();
    this.authService
      .signUp(this.signUpForm.getRawValue())
      .subscribe(async () => {
        const result = await this.alertService.showSuccess(
          'Thanks for signing up. Your account has been created.'
        );
        if (result.isDismissed) {
          this.router.navigateByUrl(EndPoints.SIGN_IN);
        }
      });
  }

  public onFormDataChange(ev: Event) {
    const inputElement = ev.target as HTMLElement;
    const formControl = this.signUpForm.get(
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
