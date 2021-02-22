import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

import { BackendCommunicationService } from '../../core/services/backend-communication.service';
import { CustomValidationService } from './services/validation.service';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss'],
})
export class SignUpFormComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;
  public errorMessage = null;
  public formWasSubmitted = false;
  public hidePassword = true;

  public firstNameControl: FormControl;
  public lastNameControl: FormControl;
  public emailControl: FormControl;
  public passwordControl: FormControl;

  public labels = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'E-mail',
    password: 'Password',
    requiredField: 'This field is required',
    invalidEmail: 'This email is invalid',
    invalidPasswordPattern: 'Password should be at least 8 characters long, contain lower and uppercase letters.',
    passwordCompromised: 'Password cannot contain first or last name.',
    friendlyErrorMessage: 'Something went wrong, please try again later!',
    thankYou: 'Thank you for registering!',
    checkEmail: 'Please check your email!',
    buttonSignUp: 'Sign up!',
    buttonSending: 'Busy...'
  };

  private customValidationFunction: ValidatorFn;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private customValidationService: CustomValidationService,
    private backendCommunicationService: BackendCommunicationService
  ) {
    this.customValidationFunction = this.customValidationService.validatorFunction;
  }

  ngOnInit(): void {
    this.loginForm = this.createForm();
  }

  createForm(): FormGroup {
    this.firstNameControl = new FormControl(null, Validators.required);
    this.lastNameControl = new FormControl(null, Validators.required);
    this.emailControl = new FormControl(null, [
      Validators.required,
      Validators.email,
    ]);
    this.passwordControl = new FormControl(null, [
      Validators.required,
      Validators.pattern(CustomValidationService.passwordRegexp),
    ]);

    return this.formBuilder.group({
      firstName: this.firstNameControl,
      lastName: this.lastNameControl,
      email: this.emailControl,
      password: this.passwordControl,
    }, { validators: this.customValidationFunction });
  }

  submitForm(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.errorMessage = null;
    this.loginForm.disable();

    const payload = this.loginForm.value;
    delete payload.password;

    this.backendCommunicationService.signUp(payload).pipe(
      catchError((err) => {
        // send errors to monitoring, show friendly message to the user
        this.errorMessage = this.labels.friendlyErrorMessage;
        return EMPTY;
      }),
      finalize(() => this.loginForm.enable()),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.formWasSubmitted = true;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
