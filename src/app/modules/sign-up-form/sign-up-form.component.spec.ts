import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { SignUpFormComponent } from './sign-up-form.component';

import { BackendCommunicationService } from '../../core/services/backend-communication.service';
import { CustomValidationService } from './services/validation.service';

describe('Component: SignUpFormComponent', () => {
  let component: SignUpFormComponent;
  let fixture: ComponentFixture<SignUpFormComponent>;
  let signUpSpy: jasmine.Spy;

  const validFormData = {
    firstName: '1',
    lastName: '2',
    email: 'a@a.com',
    password: 'asdfAasdf'
  };

  beforeEach(async () => {
    const backendCommunicationService = jasmine.createSpyObj('BackendCommunicationService', ['signUp']);
    signUpSpy = backendCommunicationService.signUp.and.returnValue(of(''));

    await TestBed.configureTestingModule({
      declarations: [
        SignUpFormComponent
      ],
      providers: [
        CustomValidationService,
        FormBuilder,
        { provide: BackendCommunicationService, useValue: backendCommunicationService }
      ]
    }).overrideComponent(SignUpFormComponent, {
      set: {
        template: '<h1>Test SignUpFormComponent</h1>',
      },
    });

    fixture = TestBed.createComponent(SignUpFormComponent);
    component = fixture.componentInstance;
  });

  describe('Sanity check:', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have class properties set up correctly', () => {
      expect(component.errorMessage).toEqual(null);
      expect(component.formWasSubmitted).toEqual(false);
      expect(component.loginForm).toBeUndefined();
      expect(component.hidePassword).toBeTrue();
      expect(component.firstNameControl).toBeUndefined();
      expect(component.lastNameControl).toBeUndefined();
      expect(component.emailControl).toBeUndefined();
      expect(component.passwordControl).toBeUndefined();
    });
  });

  describe('method onInit: ', () => {
    it('should set loginForm correctly OnInit', () => {
      component.ngOnInit();
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm.valid).toBeFalsy();
      expect(component.loginForm instanceof FormGroup).toBeTrue();
      expect(component.firstNameControl instanceof FormControl).toBeTrue();
      expect(component.lastNameControl instanceof FormControl).toBeTrue();
      expect(component.emailControl instanceof FormControl).toBeTrue();
      expect(component.passwordControl instanceof FormControl).toBeTrue();
    });
  });

  describe('method createForm:', () => {
    it('should return the variable of correct value when called', () => {
      const form = component.createForm();
      expect(form).toBeDefined();
      expect(form instanceof FormGroup).toBeTrue();
    });
  });

  describe('method submitForm:', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should not submit data if form is not valid', () => {
      expect(signUpSpy).not.toHaveBeenCalled();
    });

    it('should call signUp method of communication service if form is valid', () => {
      component.loginForm.setValue(validFormData);

      component.submitForm();

      const expected = { ...validFormData };
      delete expected.password;
      expect(signUpSpy).toHaveBeenCalledWith(expected);
    });

    it('should set default error message if post was failed', () => {
      const message = component.labels.friendlyErrorMessage;

      signUpSpy.and.returnValue(throwError({}));
      component.loginForm.setValue(validFormData);

      component.submitForm();

      expect(component.errorMessage).toEqual(message);
    });

    it('should set formWasSubmitted to true if post was successful', () => {
      signUpSpy.and.returnValue(of(true));
      component.loginForm.setValue(validFormData);

      component.submitForm();

      expect(component.errorMessage).toBeNull();
      expect(component.formWasSubmitted).toBeTruthy();
    });
  });

  describe('Sign Up form:', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should stay invalid - one of the fields is empty', () => {
      component.loginForm.setValue({
        ...validFormData,
        ...{ lastName: null }
      });
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should stay invalid - email is not valid', () => {
      component.loginForm.setValue({
        ...validFormData,
        ...{ email: 'inexistentemailaddress.com'}
      });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should stay invalid - password does not meet requirements - length', () => {
      component.loginForm.setValue({
        ...validFormData,
        ...{ password: 'passWrd'}
      });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should stay invalid - password does not meet requirements - content', () => {
      component.loginForm.setValue({
        ...validFormData,
        ...{ password: 'password'}
      });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should stay invalid - password does not meet requirements - matches first or last name', () => {
      // case 1
      component.loginForm.setValue({
        ...validFormData,
        ...{ firstName: 'John', lastName: 'Doe', password: 'Johnny1234'}
      });
      expect(component.loginForm.valid).toBeFalsy();

      // case 2
      component.loginForm.setValue({
        ...validFormData,
        ...{ firstName: 'John', lastName: 'Doe', password: 'JohDOE1234'}
      });
      expect(component.loginForm.valid).toBeFalsy();
    });

    it('should become valid if valid input provided', () => {
      component.loginForm.setValue(validFormData);
      expect(component.loginForm.valid).toBeTruthy();
    });
  });
});
