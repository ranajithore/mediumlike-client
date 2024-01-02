import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import validator from 'validator';

export class CustomValidators {
  public static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      return validator.isStrongPassword(value) ? null : { WeakPassword: true };
    };
  }

  public static confirmPassword(matchFieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const matchFieldControl = control.parent?.get(matchFieldName);
      const matchFieldvalue = matchFieldControl?.value;
      const value = control.value;
      if (!value) return null;
      return matchFieldvalue === value ? null : { WeakPassword: true };
    };
  }
}
