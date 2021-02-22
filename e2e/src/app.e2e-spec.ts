import { browser, logging, ElementFinder } from 'protractor';
import { AppPage } from './app.pageobjects';

describe('Fe-Sign-Up-App E2E Tests', () => {
  let page: AppPage;
  let firstName: ElementFinder;
  let password: ElementFinder;
  let submit: ElementFinder;
  let passwordError = '';

  beforeEach(async () => {
    page = new AppPage();
    await page.navigateTo();

    firstName = await page.getInputField('firstName');
    password = await page.getInputField('password');
    submit = await page.getSubmitButton();
  });

  it('should display welcome message', async () => {
    expect(await page.getTitleText()).toEqual('SignUp');
  });

  it('should show form cross validation error when password is compromised', async () => {
    firstName.sendKeys('A');
    password.sendKeys('aaaaaaaaA');
    submit.click();
    await browser.sleep(500);

    passwordError = await page.getPasswordError();
    expect(passwordError).toContain('Password cannot contain first or last name.');
  });

  it('should show pattern validation error when password does not meet pattern requirement', async () => {
    firstName.sendKeys('Ann');

    // case 1
    password.sendKeys('123434');
    submit.click();
    await browser.sleep(500);

    passwordError = await page.getPasswordError();
    expect(passwordError).toContain('Password should be at least 8 characters long, contain lower and uppercase letters.');

    // case 2
    password.sendKeys('123434asdasd');
    submit.click();
    await browser.sleep(500);

    passwordError = await page.getPasswordError();
    expect(passwordError).toContain('Password should be at least 8 characters long, contain lower and uppercase letters.');
  });

  it('should show both errors when password does not meet patter requirements and also compromised', async () => {
    firstName.sendKeys('A');
    password.sendKeys('a');
    submit.click();
    await browser.sleep(500);

    passwordError = await page.getPasswordError();
    expect(passwordError).toContain('Password should be at least 8 characters long, contain lower and uppercase letters.Password cannot contain first or last name.');
  });

  it('should remove all errors when password is not compromised and meets requirements', async () => {
    firstName.sendKeys('A');
    password.sendKeys('a');
    submit.click();
    await browser.sleep(500);

    firstName.sendKeys('Ann');
    password.sendKeys('asdfAasdf');
    submit.click();
    await browser.sleep(500);

    passwordError = await page.getPasswordError();
    expect(passwordError).toEqual('');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
