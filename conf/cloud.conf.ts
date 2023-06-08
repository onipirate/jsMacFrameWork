/* eslint-disable @typescript-eslint/no-explicit-any */
import { config as baseConfig } from './base.conf';
import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

const runCrossBrowser = env.CROSS_BROWSER === 'true';

//Default Browser
const chromeCapabilities = {
  browserName: 'chrome',
  browserVersion: 'latest',
  'bstack:options': {
    os: 'Windows',
    osVersion: '11',
    local: true,
    localIdentifier: env.BROWSERSTACK_LOCAL_IDENTIFIER
  },
  acceptInsecureCerts: true
};

const dateTimeString = new Date()
  .toLocaleTimeString('en-US', {
    timeZoneName: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  .replace(',', '');

const parallelConfig = {
  maxInstances: 6,
  commonCapabilities: {
    'bstack:options': {
      buildName: `${env.PROJECT_NAME} - ${dateTimeString}`
    }
  },
  capabilities: [chromeCapabilities]
};

if (runCrossBrowser) {
  parallelConfig.capabilities = [
    chromeCapabilities,
    {
      browserName: 'edge',
      browserVersion: 'latest',
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Ventura',
        local: true,
        localIdentifier: env.BROWSERSTACK_LOCAL_IDENTIFIER
      },
      acceptInsecureCerts: true
    },
    {
      browserName: 'firefox',
      browserVersion: 'latest',
      'bstack:options': {
        os: 'Windows',
        osVersion: '11',
        local: true,
        localIdentifier: env.BROWSERSTACK_LOCAL_IDENTIFIER
      },
      acceptInsecureCerts: true
    }
  ];
}

export const config = { ...baseConfig, ...parallelConfig };

// Code to support common capabilities
exports.config.capabilities.forEach(function (caps: { [x: string]: any }) {
  for (const i in exports.config.commonCapabilities)
    caps[i] = { ...caps[i], ...exports.config.commonCapabilities[i] };
});
