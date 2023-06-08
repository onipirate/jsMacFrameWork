import { config as baseConfig } from './base.conf';
import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

const specsPath = env.SPECS_PATH ?? '../src/tests/e2e/apac/**/*.ts';
const localConfig = {
  services: ['chromedriver'],
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      acceptInsecureCerts: true
      // 'goog:chromeOptions': {
      //   args: ['--headless', 'user-agent=...', '--disable-gpu', '--window-size=1920,1080']
      // }
    }
  ],
  specs: [specsPath]
};

export const config = { ...baseConfig, ...localConfig };
