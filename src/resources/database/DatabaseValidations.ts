/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import * as chai from 'chai';
import chaiJsonSchema from 'chai-json-schema';
import MySQL from '../../common/database/MySQL';
import {
  bgApplicationsSessionsFields,
  bgAuthsFields,
  bgBillingTokenFields,
  bgCCMetadataFields,
  bgNetworkTransactionMetadata,
  bgPaymentsFields,
  collectPaymentFields
} from './DatabaseTableFields';
import Allure from '../../resources/utils/Allure';
import { getBillingTokenUsingCaseNumber, getTransacTionDetailsUsingMDN } from './DatabaseHelpers';
import {
  queryBGApplicationSessions,
  queryBGAuths,
  queryBGBillingTokens,
  queryBGCCMetadata,
  queryBGNetworkTransactionMetadata,
  queryBGPayments
} from './DatabaseQueries';
import { ConnectionOptions } from 'mysql2';
chai.use(chaiJsonSchema);

export const verifyBGDBTablesUsingBillingToken = async (
  connection: ConnectionOptions,
  billingToken: string
) => {
  try {
    Allure.logStep(`Verifying BG Tables using billing token = ${billingToken}`);
    await Promise.all([
      verifyBGBillingTokenTable(connection, billingToken),
      verifyBGApplicationsSessionsTable(connection, billingToken),
      verifyBGAuthsTable(connection, billingToken),
      verifyBGPaymentsTable(connection, billingToken),
      verifyBGCCMetadataTable(connection, billingToken)

      //TODO: add validations for ISTI
      // verifyBGNetworkTransactionMetadataTable(connection, billingToken)
    ]);
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};

export const verifyBGDBTablesUsingCaseNumber = async (
  connection: ConnectionOptions,
  caseNumber: number
) => {
  try {
    const billingToken = await getBillingTokenUsingCaseNumber(connection, caseNumber);
    Allure.logStep(`Verifying BG Tables using case number = ${caseNumber}`);
    await Promise.all([
      verifyBGBillingTokenTable(connection, billingToken),
      verifyBGApplicationsSessionsTable(connection, billingToken),
      verifyBGAuthsTable(connection, billingToken),
      verifyBGPaymentsTable(connection, billingToken),
      verifyBGCCMetadataTable(connection, billingToken)

      //TODO: add validations for ISTI
      //verifyBGNetworkTransactionMetadataTable(connection, billingToken)
    ]);
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};

export const verifyBGBillingTokenTable = async (
  connection: ConnectionOptions,
  billingToken: string
) => {
  const db: MySQL = new MySQL(connection);
  await db.connect();
  try {
    const res = await db.executeQuery(queryBGBillingTokens(billingToken));
    expect(res.fields).to.be.deep.equal(bgBillingTokenFields);
    //TODO: update db res validations
    expect(res.rows[0]).to.be.not.empty;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  } finally {
    await db.disconnect();
  }
};

export const verifyBGApplicationsSessionsTable = async (
  connection: ConnectionOptions,
  billingToken: string
) => {
  const db: MySQL = new MySQL(connection);
  await db.connect();
  try {
    const res = await db.executeQuery(queryBGApplicationSessions(billingToken));
    expect(res.fields).to.be.deep.equal(bgApplicationsSessionsFields);
    //TODO: update db res validations
    expect(res.rows[0]).to.be.not.empty;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  } finally {
    await db.disconnect();
  }
};

export const verifyBGAuthsTable = async (connection: ConnectionOptions, billingToken: string) => {
  const db: MySQL = new MySQL(connection);
  await db.connect();
  try {
    const res = await db.executeQuery(queryBGAuths(billingToken));
    expect(res.fields).to.be.deep.equal(bgAuthsFields);
    //TODO: update db res validations
    expect(res.rows[0]).to.be.not.empty;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  } finally {
    await db.disconnect();
  }
};

export const verifyBGPaymentsTable = async (
  connection: ConnectionOptions,
  billingToken: string
) => {
  const db: MySQL = new MySQL(connection);
  await db.connect();
  try {
    const res = await db.executeQuery(queryBGPayments(billingToken));
    expect(res.fields).to.be.deep.equal(bgPaymentsFields);
    //TODO: update db res validations
    expect(res.rows[0]).to.be.not.empty;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  } finally {
    await db.disconnect();
  }
};

export const verifyBGCCMetadataTable = async (
  connection: ConnectionOptions,
  billingToken: string
) => {
  const db: MySQL = new MySQL(connection);
  await db.connect();
  try {
    const res = await db.executeQuery(queryBGCCMetadata(billingToken));
    expect(res.fields).to.be.deep.equal(bgCCMetadataFields);
    //TODO: update db res validations
    expect(res.rows[0]).to.be.not.empty;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  } finally {
    await db.disconnect();
  }
};

export const verifyBGNetworkTransactionMetadataTable = async (
  connection: ConnectionOptions,
  billingToken: string
) => {
  const db: MySQL = new MySQL(connection);
  await db.connect();
  try {
    const res = await db.executeQuery(queryBGNetworkTransactionMetadata(billingToken));
    expect(res.fields).to.be.deep.equal(bgNetworkTransactionMetadata);
    //TODO: update db res validations
    expect(res.rows[0]).to.be.not.empty;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  } finally {
    await db.disconnect();
  }
};

export const verifyAndRetrieveAPACBGDBResponse = async (
  connection: ConnectionOptions,
  mdn: number
) => {
  try {
    Allure.logStep('Verifying APAC DB BG Response');
    const transactionDetails = await getTransacTionDetailsUsingMDN(connection, mdn);
    const bgCollectPaymentRes = JSON.parse(transactionDetails.rows[0].RESPONSE);

    const collectPaymentRspn = bgCollectPaymentRes.collectPaymentResponse.collectPaymentRspn;

    expect(bgCollectPaymentRes).to.be.jsonSchema(collectPaymentFields);
    expect(collectPaymentRspn.returnMsg).to.be.equal('OK');
    expect(collectPaymentRspn.returnCode).to.be.equal('BG-0');

    return transactionDetails;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};
