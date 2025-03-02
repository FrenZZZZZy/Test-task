import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function jsonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    try {
      return JSON.parse(control.value) && !!control.value;
    } catch (e) {
      return { invalidJson: true };
    }
  };
}
