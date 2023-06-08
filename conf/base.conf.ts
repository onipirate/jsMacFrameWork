import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

const specsPath = env.SPECS_PATH ?? '../src/tests/e2e/apac/**/*.ts';
export const config: WebdriverIO.Config = {
  user: env.BROWSERSTACK_USERNAME,
  key: env.BROWSERSTACK_ACCESS_KEY,

  specs: [specsPath],
  exclude: [],

  logLevel: 'warn',
  baseUrl: '',
  waitforTimeout: 180000,
  connectionRetryTimeout: 240000,
  connectionRetryCount: 3,
  hostname: 'hub.browserstack.com',
  services: [
    [
      'browserstack',
      {
        testObservability: true,
        testObservabilityOptions: {
          projectName: env.BROWSERSTACK_PROJECT_NAME,
          buildName: env.PROJECT_NAME,
          buildTag: env.BUILD_URL
        }
      }
    ]
  ],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 600000
  },
  specFileRetries: 1,
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false
      }
    ]
  ],

  beforeTest: async () => {
    await browser.maximizeWindow();
  },
  capabilities: []
};
