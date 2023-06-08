import { ChainablePromiseElement } from 'webdriverio';
import allure from '@wdio/allure-reporter';

const EXCEPTION_MESSAGE = 'Exception while accessing element.';
export default class PageActions {
  /**
   * Opens the given URL
   * @param url page URL to be opened (e.g. http://www.asurion.com/)
   */
  async openPage(url: string) {
    allure.addStep(`Open Page URL: ${url}`);
    return browser.url(url);
  }

  /**
   * Click a Promise web element
   *
   * @param webElement The web element to click
   */
  async click(webElement: ChainablePromiseElement<WebdriverIO.Element>) {
    try {
      await webElement.waitForClickable();
      await webElement.moveTo();
      await webElement.click();
    } catch (e) {
      allure.addStep(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
      throw new Error(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
    }
  }

  /**
   * Click a web element and specify a timeout for its execution
   *
   * @param webElement The web element to click
   * @param timeToWait  The time to wait in milliseconds
   */
  async clickWithTimeout(
    webElement: ChainablePromiseElement<WebdriverIO.Element>,
    timeToWait: number
  ) {
    try {
      await webElement.waitForClickable({ timeout: timeToWait });
      await webElement.moveTo();
      await webElement.click();
    } catch (e) {
      allure.addStep(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
      throw new Error(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
    }
  }

  /**
   * This method scrolls to the Web Element and enters the specified text value in
   * the input field. The purpose of this method is to have a common method that
   * sets the focus on a Web Element to enter the text value.
   *
   * @param webElement   Web Element to enter the text value
   * @param text String value to enter in the input field
   */
  async enterText(webElement: ChainablePromiseElement<WebdriverIO.Element>, text: string | number) {
    try {
      await webElement.waitForEnabled();
      await webElement.moveTo();
      await webElement.clearValue().then(async () => {
        await webElement.setValue(text);
      });
    } catch (e) {
      allure.addStep(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
      throw new Error(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
    }
  }

  /**
   * This method scrolls to the Web Element and enters the specified text value in
   * the input field. The purpose of this method is to have a common method that
   * sets the focus on a Web Element to enter the text value.
   *
   * @param webElement   Web Element to enter the text value
   * @param text String value to enter in the input field
   * @param timeToWait  The time to wait in milliseconds
   */
  async enterTextWithTimeout(
    webElement: ChainablePromiseElement<WebdriverIO.Element>,
    text: string | number,
    timeToWait: number
  ) {
    try {
      await webElement.waitForEnabled({ timeout: timeToWait });
      await webElement.moveTo();
      await webElement.clearValue().then(async () => {
        await webElement.setValue(text);
      });
    } catch (e) {
      allure.addStep(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
      throw new Error(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
    }
  }

  /**
   * This method selects the option at the given index.
   *
   * @param webElement    Webelement for which value has to be selected
   * @param index index value of the option
   */
  async selectDropdownByIndex(
    webElement: ChainablePromiseElement<WebdriverIO.Element>,
    index: number
  ) {
    try {
      await webElement.waitForDisplayed();
      await webElement.moveTo();
      await webElement.selectByIndex(index);
    } catch (e) {
      allure.addStep(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
      throw new Error(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
    }
  }

  /**
   * This method selects the option by the given text.
   *
   * @param webElement    Webelement for which value has to be selected
   * @param text text value of the option
   */
  async selectDropdownByText(
    webElement: ChainablePromiseElement<WebdriverIO.Element>,
    text: string
  ) {
    try {
      await webElement.waitForDisplayed();
      await webElement.moveTo();
      await webElement.selectByVisibleText(text);
    } catch (e) {
      allure.addStep(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
      throw new Error(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
    }
  }
  /**
   * This method selects the option by the given text.
   *
   * @param webElement    Webelement for which value has to be selected
   * @param value text value of the option
   */
  async selectDropdownByValue(
    webElement: ChainablePromiseElement<WebdriverIO.Element>,
    value: string
  ) {
    try {
      await webElement.waitForDisplayed();
      await webElement.moveTo();
      await webElement.selectByAttribute('value', value);
    } catch (e) {
      allure.addStep(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
      throw new Error(`${EXCEPTION_MESSAGE} ${(e as Error).message}`);
    }
  }
}
