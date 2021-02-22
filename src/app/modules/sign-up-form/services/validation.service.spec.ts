import { CustomValidationService } from './validation.service';
import { AbstractControl } from '@angular/forms';
import { generateControlObject } from '../../../core/testing/mock-helper';

describe ('Service CustomValidationService:', () => {
  let service: CustomValidationService;

  beforeEach(() => {
    service = new CustomValidationService();
  });

  it('should have defined static fields', () => {
     expect(CustomValidationService.passwordRegexp).toBeDefined();
     expect(CustomValidationService.passwordRegexp instanceof RegExp).toBeTruthy();
  });

  describe('Method getCompromisedState: ', () => {
    it('should return false when password does not contain lastName and/or firstName', () => {
      const expected = false;
      const controlsState = {
        firstName: '2',
        lastName: '1',
        password: 'asdfAasdf'
      };

      const { control } = generateControlObject(controlsState);
      const actual = service.getCompromisedState(control as unknown as AbstractControl);

      expect(actual).toEqual(expected);
    });

    it('should return false when lastName/firstName is empty and other control field is valid', () => {
      const expected = false;
      const controlsState = {
        firstName: null,
        lastName: '1',
        password: 'asdfAasdf'
      };

      const { control } = generateControlObject(controlsState);
      const actual = service.getCompromisedState(control as unknown as AbstractControl);

      expect(actual).toEqual(expected);
    });

    it('should return true when password contains lastName and/or firstName, lower case', () => {
      const expected = true;
      const controlsState = {
        firstName: 'Faas',
        lastName: '1',
        password: 'asdfAaSdf'
      };

      const { control } = generateControlObject(controlsState);
      const actual = service.getCompromisedState(control as unknown as AbstractControl);

      expect(actual).toEqual(expected);
    });

    it('should return true when password contains lastName and/or firstName, upper case', () => {
      const expected = true;
      const controlsState = {
        firstName: '2',
        lastName: 'ASD1',
        password: 'asd1fAaSdf'
      };

      const { control } = generateControlObject(controlsState);
      const actual = service.getCompromisedState(control as unknown as AbstractControl);

      expect(actual).toEqual(expected);
    });
  });

  describe('Method getErrorState: ', () => {
    it('should return null when no controls with error state present', () => {
      const expected = null;
      const existingErrors = null;
      const compromised = false;

      const actual = service.getErrorState(existingErrors, compromised);
      expect(actual).toEqual(expected);
    });

    it('should return an object with existing errors without compromised error if compromised param is false', () => {
      const expected = { minlength: true, someothererrors: true };
      const existingErrors = expected;
      const compromised = false;

      const actual = service.getErrorState(existingErrors, compromised);
      expect(actual).toEqual(expected);
    });

    it('should return an object with existing errors and compromised error when compromised param is true', () => {
      const expected = { minlength: true, someothererrors: true, compromised: true };
      const existingErrors = expected;
      const compromised = true;

      const actual = service.getErrorState(existingErrors, compromised);
      expect(actual).toEqual(expected);
    });

    it('should return an object with compromised error only when no existing errors and compromised param is true', () => {
      const expected = { compromised: true };
      const existingErrors = null;
      const compromised = true;

      const actual = service.getErrorState(existingErrors, compromised);
      expect(actual).toEqual(expected);
    });
  });

  describe('Method validatorFunction: ', () => {
    it('should return null if password value is empty', () => {
      const expected = null;

      const controlsState = {
        firstName: '2',
        lastName: '1',
        password: null
      };

      const { control } = generateControlObject(controlsState);
      const actual = service.validatorFunction(control as unknown as AbstractControl);
      expect(actual).toEqual(expected);
    });

    it('should call service methods when password value is not empty', () => {
      const getCompromisedStateSpy = spyOn(service, 'getCompromisedState').and.returnValue(false);
      const getErrorStateSpy = spyOn(service, 'getErrorState').and.returnValue(null);

      const controlsState = {
        firstName: '2',
        lastName: '1',
        password: 'asdfAasdf'
      };

      const { control } = generateControlObject(controlsState);
      service.validatorFunction(control as unknown as AbstractControl);

      expect(getCompromisedStateSpy).toHaveBeenCalled();
      expect(getErrorStateSpy).toHaveBeenCalled();
    });

    it('should call setErrors on control instance with correct value', () => {
      const controlsState = {
        firstName: 'Aas',
        lastName: '1',
        password: 'asdfAasdf'
      };

      const { control, spyObject: setErrorsSpy } = generateControlObject(controlsState, true);

      service.validatorFunction(control as unknown as AbstractControl);

      expect(setErrorsSpy).toHaveBeenCalledWith({ compromised: true });
    });

    it('should return value of correct shape when errors present', () => {
      const expected = { compromised: true };
      const controlsState = {
        firstName: 'Aas',
        lastName: '1',
        password: 'asdfAasdf'
      };

      const { control } = generateControlObject(controlsState);

      const actual = service.validatorFunction(control as unknown as AbstractControl);

      expect(actual).toEqual(expected);
    });

    it('should return value of correct shape when there are no errors', () => {
      const expected = null;
      const controlsState = {
        firstName: '2',
        lastName: '1',
        password: 'asdfAasdf'
      };

      const { control } = generateControlObject(controlsState);

      const actual = service.validatorFunction(control as unknown as AbstractControl);

      expect(actual).toEqual(expected);
    });
  });
});
