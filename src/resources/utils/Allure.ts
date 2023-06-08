import { allure as mochaAllure } from 'allure-mocha/runtime';
import { default as allure } from '@wdio/allure-reporter';
import dotenv from 'dotenv';
dotenv.config();
/**
 * @description: Class for Allure Reporter functions
 */
export class Allure {
  /**
   * This method outputs logs into generated Allure Report
   *
   * @param desc desc to be included on the logs
   */
  logStep = async (desc: string) => {
    if (process.env.npm_lifecycle_script?.includes('mocha')) {
      mochaAllure.logStep(desc);
    } else {
      allure.addStep(desc);
    }
  };

  attachment = async (desc: string, content: string) => {
    if (process.env.npm_lifecycle_script?.includes('mocha')) {
      mochaAllure.attachment(desc, JSON.stringify(JSON.parse(content), null, 2), 'text/plain');
    } else {
      allure.addAttachment(desc, JSON.stringify(JSON.parse(content), null, 2), 'text/plain');
    }
  };
}

export default new Allure();
