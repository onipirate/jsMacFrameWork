import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

interface Headers {
  Authorization: string;
  'Asurion-apikey': string | undefined;
  'Asurion-correlationid': string;
  'Asurion-client': string;
  'Content-Type'?: string;
  Accept?: string;
  'Asurion-region'?: string;
  'Asurion-channel'?: string;
  'Asurion-lineofbusiness'?: string;
  'Asurion-enduser'?: string;
  'Asurion-enduserdomain'?: string;
}

export const headers: Headers = {
  Authorization: `Basic ${env.API_TOKEN}`,
  'Asurion-apikey': env.API_KEY,
  'Asurion-correlationid': 'SBQA',
  'Asurion-client': 'Verizon',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'Asurion-region': 'North America',
  'Asurion-channel': 'Agent',
  'Asurion-lineofbusiness': 'Mobility',
  'Asurion-enduser': 'SQATest',
  'Asurion-enduserdomain': 'SQATest'
};
