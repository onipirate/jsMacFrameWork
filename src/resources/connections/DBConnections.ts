import dotenv from 'dotenv';
import { ConnectionOptions } from 'mysql2/promise';
import { env } from 'process';
dotenv.config();

export const BGUSConnectionOptions: ConnectionOptions = {
  host: 'backoffice-bgtwy-npr-db-usa.backoffice.npr.aws.asurion.net',
  port: 3330,
  user: env.BG_DB_US_USERNAME as string,
  password: env.BG_DB_US_PASSWORD as string,
  database: 'bgqa'
};

export const BGAPACConnectionOptions: ConnectionOptions = {
  host: 'backoffice-bgtwy-npr-db-seoul.backoffice.npr.aws.asurion.net',
  port: 3330,
  user: env.BG_DB_APAC_USERNAME as string,
  password: env.BG_DB_APAC_PASSWORD as string,
  database: 'bgqa'
};

export const APACConnectionOptions: ConnectionOptions = {
  host: 'aurora-sqa.consoleone.apac.npr.aws.asurion.net',
  port: 3306,
  user: env.APAC_DB_USERNAME as string,
  password: env.APAC_DB_PASSWORD as string
};
