import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
  async navigateTo(): Promise<any> {
    return browser.get(browser.baseUrl);
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-page-template .header h1')).getText();
  }

  async getInputField(fieldName): Promise<ElementFinder> {
    return element(by.css(`input[formcontrolname="${fieldName}"]`));
  }

  async getSubmitButton(): Promise<ElementFinder> {
    return element(by.css('button'));
  }

  async getPasswordError(): Promise<string> {
    const errors = await element.all(by.tagName('mat-error'));

    return errors[0] ? errors[0].getText() : '';
  }
}
