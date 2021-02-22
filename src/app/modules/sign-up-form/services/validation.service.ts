import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

type ErrorStateValue = null | {[key: string]: boolean};

@Injectable()
export class CustomValidationService {

  static passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*?&\-_]{8,}$/;

  getCompromisedState(control: AbstractControl): boolean {
    const firstName = control.get('firstName').value;
    const lastName = control.get('lastName').value;
    let password = control.get('password').value;
    password = password.toLowerCase();

    const compromised =
      (firstName && password.includes(firstName.toLowerCase())) ||
      (lastName && password.includes(lastName.toLowerCase()));

    return !!compromised;
  }

  getErrorState(existingErrors: ErrorStateValue, compromised: boolean): ErrorStateValue {
    let errors = existingErrors;

    if (compromised) {
      errors = { ...errors, ...{ compromised: true } };
    } else {
      if (errors) {
        delete errors.compromised;
      }
    }

    if (errors && !Object.entries(errors).length) {
      errors = null;
    }

    return errors;
  }

  validatorFunction = (control: AbstractControl): ErrorStateValue => {
    const passwordControl = control.get('password');
    if (!passwordControl.value) {
      return null;
    }

    const compromisedState = this.getCompromisedState(control);
    const errorState = this.getErrorState(passwordControl.errors, compromisedState);

    passwordControl.setErrors(errorState);

    return errorState;
  }
}
