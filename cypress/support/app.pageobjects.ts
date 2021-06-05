export const pageElements = {
  header: 'header',
  firstName: 'firstName',
  lastName: 'lastName',
  password: 'password',
  email: 'email',
  submit: 'submit',
  errorMessage: 'errorMessage',
};

export const validationErrorMessages = {
  firstLastName: 'Password cannot contain first or last name.',
  passwordSpecificity: 'Password should be at least 8 characters long, contain lower and uppercase letters.',
};

export const cyGet = (cypressSelector: string): Cypress.Chainable => {
  return cy.get(`[data-cy=${cypressSelector}]`);
};


