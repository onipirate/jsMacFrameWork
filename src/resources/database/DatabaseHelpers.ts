/* eslint-disable @typescript-eslint/no-explicit-any */
import MySQL from '../../common/database/MySQL';
import {
  getAPACTxnDetailsQuery,
  queryBGApplicationSessionsUsingCaseNumber
} from './DatabaseQueries';
import Allure from '../../resources/utils/Allure';
import { ConnectionOptions } from 'mysql2/promise';

export const getTransacTionDetailsUsingMDN = async (connection: ConnectionOptions, mdn: number) => {
  try {
    Allure.logStep('Retrieving Transaction Details Using MDN');
    const db: MySQL = new MySQL(connection);
    await db.connect();

    const transactionDetailsQuery = getAPACTxnDetailsQuery(mdn);
    const transactionDetails = await db.executeQuery(transactionDetailsQuery);
    await db.disconnect();

    return transactionDetails;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};

export const getBillingTokenUsingCaseNumber = async (
  connection: ConnectionOptions,
  caseNumber: number
) => {
  try {
    Allure.logStep('Retrieving PCI Token or Billing Token');
    const db: MySQL = new MySQL(connection);
    await db.connect();

    const bgApplicationSessionsRes = await db.executeQuery(
      queryBGApplicationSessionsUsingCaseNumber(caseNumber)
    );
    const billingToken = bgApplicationSessionsRes.rows[0].billingToken;
    Allure.logStep(`Billing Token Retrieved : ${billingToken}`);
    await db.disconnect();

    return billingToken;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};

export const getBillingToken = async (connection: ConnectionOptions, mdn: number) => {
  try {
    Allure.logStep('Retrieving PCI Token or Billing Token');
    const transactionDetails = await getTransacTionDetailsUsingMDN(connection, mdn);
    const bgCollectPaymentResponse = JSON.parse(transactionDetails.rows[0].REQUEST);

    const billingToken = bgCollectPaymentResponse.CollectPaymentRequest.PCIToken;
    Allure.logStep(`Billing Token Retrieved : ${billingToken}`);

    return billingToken;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};

export const getBillingTokenFromAPACDB = async (transactionDetails: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[];
  fields: string[];
}) => {
  try {
    Allure.logStep('Retrieving PCI Token or Billing Token from APAC DB');
    const bgCollectPaymentResponse = JSON.parse(transactionDetails.rows[0].REQUEST);

    const billingToken = bgCollectPaymentResponse.CollectPaymentRequest.PCIToken;
    Allure.logStep(`PCI Token or Billing Token Retrieved : ${billingToken}`);

    return billingToken;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};

export const getCustomerCaseNumber = async (connection: ConnectionOptions, mdn: number) => {
  try {
    Allure.logStep('Retrieving Customer Case Number');
    const transactionDetails = await getTransacTionDetailsUsingMDN(connection, mdn);
    const customerCaseNumber = transactionDetails.rows[0].CUSTOMER_CASE_NBR;

    Allure.logStep(`Customer Case Number Retrieved : ${customerCaseNumber}`);

    return customerCaseNumber;
  } catch (error) {
    throw new Error(`${(error as Error).message}`);
  }
};
