import { cyGet, pageElements as p, validationErrorMessages } from '../support/app.pageobjects';

describe('Fe-Sign-Up-App E2E Tests', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('should display welcome message', () => {
    cyGet(p.header).should('have.text', 'SignUp');
  });

  it('should show form cross validation error when password is compromised', () => {
    cyGet(p.firstName).type('A');
    cyGet(p.password).type('aaaaaaaaA');
    cyGet(p.submit).click();

    cyGet(p.errorMessage)
        .should('have.length', 1)
        .and('have.text', validationErrorMessages.firstLastName);
  });

  it('should show pattern validation error when password does not meet pattern requirement', async () => {
    cyGet(p.firstName).type('Ann');

    // case 1
    cyGet(p.password).type('123434');
    cyGet(p.submit).click();
    cyGet(p.errorMessage)
        .should('have.length', 1)
        .and('have.text', validationErrorMessages.passwordSpecificity);

    // case 2
    cyGet(p.password).type('123434asdasd');
    cyGet(p.submit).click();
    cyGet(p.errorMessage)
        .should('have.length', 1)
        .and('have.text', validationErrorMessages.passwordSpecificity);
  });

  it('should show both errors when password does not meet patter requirements and also compromised', () => {
    cyGet(p.firstName).type('A');
    cyGet(p.password).type('a');
    cyGet(p.submit).click();
    cyGet(p.errorMessage)
        .should('have.length', 1)
        .and('have.text', validationErrorMessages.passwordSpecificity +  validationErrorMessages.firstLastName);
  });

  it('should remove all errors when password is not compromised and meets requirements', () => {
    // generate validation errors
    cyGet(p.firstName).type('A');
    cyGet(p.password).type('a');
    cyGet(p.submit).click();
    cyGet(p.errorMessage).should('have.length', 1);

    // clear validation errors
    cyGet(p.firstName).type('Ann');
    cyGet(p.password).type('asdfAasdf');
    cyGet(p.submit).click();
    cyGet(p.errorMessage).should('have.length', 0);
  });
});
