import { APACClient } from '../data/Constants';

export const queryBGBillingTokens = (billingToken: string) => {
  return `SELECT * FROM BGBillingTokens WHERE billingToken ='${billingToken}';`;
};

export const queryBGApplicationSessions = (billingToken: string) => {
  return `SELECT * FROM BGApplicationSessions WHERE billingToken ='${billingToken}';`;
};

export const queryBGApplicationSessionsUsingCaseNumber = (caseNumber: number) => {
  return `SELECT * FROM BGApplicationSessions WHERE legacyPayload like '%${caseNumber}%';`;
};

export const queryBGAuths = (billingToken: string) => {
  return `SELECT * FROM BGAuths WHERE billingToken = '${billingToken}'`;
};

export const queryBGPayments = (billingToken: string) => {
  return `SELECT * FROM BGPayments WHERE billingToken = '${billingToken}';`;
};

export const queryBGCCMetadata = (billingToken: string) => {
  return `SELECT * FROM BGCCMetadata WHERE billingToken = '${billingToken}';`;
};

export const queryBGNetworkTransactionMetadata = (billingToken: string) => {
  return `SELECT * FROM BGNetworkTransactionMetadata WHERE billingToken = '${billingToken}';`;
};

export const queryBGRefunds = (paymentId: string) => {
  return `SELECT * FROM BGRefunds WHERE paymentId =  '${paymentId}';`;
};

//APAC DB
export const queryMDN = (client: string) => {
  let assetName;
  switch (client) {
    case APACClient.AIS:
      assetName = 'HUAWEI MATE20 MIDNIGHT BLUE';
      break;
    case APACClient.M1:
      assetName = 'HUA WEI (GSM) HUAWEI MATE 10, BROWN';
      break;
    case APACClient.STARHUB:
      assetName = 'EHUA0004103 HUAWEI P20 PRO TWILIGHT';
      break;
    case APACClient.SINGTEL:
      assetName = '320007050N APPLE IPHONE_SE_64GB SGRAY_MLM62ZA_A';
      break;
    case APACClient.CELCOM:
      assetName = 'HUAWEI HONOR 9 Lite (32GB) BLUE';
      break;
    case APACClient.TRUE:
      assetName = 'HUAWEI Y7 PRO 19 RED';
      break;
    default:
      throw new Error('Invalid client');
  }
  return `SELECT DISTINCT AST.MOBILE_DEVICE_NBR
        FROM ASSET.AGREEMENT AG 
        INNER JOIN ASSET.AGREEMENT_ASSET_XREF AAX ON AG.AGREEMENT_ID = AAX.AGREEMENT_ID 
        INNER JOIN ASSET.ASSET AST ON AAX.ASSET_ID = AST.ASSET_ID 
        INNER JOIN ASSET.ASSET_CATALOG AC ON AST.ASSET_CATALOG_ID = AC.ASSET_CATALOG_ID 
        LEFT JOIN CUSTOMER.CUSTOMER_CASE CC ON AG.AGREEMENT_ID = CC.AGREEMENT_ID 
        INNER JOIN PRODUCT.CLIENT_OFFER CO ON CO.CLIENT_OFFER_ID = AG.CLIENT_OFFER_ID 
        INNER JOIN CLIENT.CLIENT_CHANNEL CCH ON CO.CLIENT_CHANNEL_ID = CCH.CLIENT_CHANNEL_ID 
        INNER JOIN PRODUCT.CLIENT_OFFER_LOOKUP COL ON COL.CLIENT_OFFER_ID = CO.CLIENT_OFFER_ID 
        WHERE AST.MOBILE_DEVICE_NBR IS NOT NULL 
        AND AC.ASSET_CATALOG_NAME LIKE '%${assetName}%'
        AND AST.MOBILE_DEVICE_NBR != '' 
        AND AG.AGREEMENT_STATUS_CODE = 'ACTV' 
        AND CCH.NAME = '${client}' 
        AND CUSTOMER_CASE_NBR IS NULL 
        ORDER BY AG.CREATED_DATE DESC
        LIMIT 100;`;
};

export const getAPACTxnDetailsQuery = (mdn: number) => {
  return `SELECT * FROM FINANCE.TRANSACTION_DETAIL WHERE REQUEST LIKE '%${mdn}%';`;
};

export const getIMEIQuery = (mdn: number) => {
  return `SELECT DISTINCT AD.SERIAL_NBR  FROM ASSET.ASSET AD WHERE AD.MOBILE_DEVICE_NBR LIKE '%${mdn}%';`;
};
