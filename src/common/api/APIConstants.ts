export const hostname = {
  BG_V3_US_HOST: 'https://us.payments.npr.fast.asurion.com',
  BG_V3_AP_HOST: 'https://us.payments.npr.fast.asurion.com',
  BG_L7_US_HOST: 'https://apigw.sqa.asurionapi.com:8443'
};

export const method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

export const statusText = {
  OK: 'OK',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  NO_CONTENT: 'No Content',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  NOT_FOUND: 'Not Found',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  UNPROCESSABLE_ENTITY: 'Unprocessable Entity',
  //BG Statuses
  AUTHENTICATION_FAILED: 'Authentication Failed',
  NOT_ACCEPTABLE: 'Not Acceptable',
  PROCESS_FAILURE: 'ProcessFailure',
  INVALID_DATA: 'InvalidData',
  SYSTEM_ERROR: 'SystemError'
};

export const dataStatus = {
  SUCCESS: 'SUCCESS',
  ACTIVE: 'ACTIVE',
  SUBMITTED_REFUND: 'SUBMITTED_REFUND',
  DELETED: 'DELETED'
};

export const errorMessage = {
  MISSING_MANDATORY_HEADER:
    'One of the mandatory header field {Asurion-apikey/ Asurion-client/ Asurion-correlationid} is empty. Client SHOULD NOT retry the request without fixing the error',
  AUTHENTICATION_FAILED:
    'Requires valid Basic Credentials / Client Certificate / Token / Key in order to connect to the Service',
  NOT_ACCEPTABLE:
    'The resource identified by the request is not capable of generating a response in any format specified by the accept headers sent in the request.',
  MISSING_TXN_TYPE: 'Missing parameter: "txn_type".',
  MISSING_SRC_TRANSACTION_ID: 'Missing parameter: "srcTransactionId".',
  NO_TRANSACTION_FOUND: 'No transactions found for the given transactionId',
  INVALID_SECURITY_TOKEN_OR_TOKEN_EXPIRED: 'Invalid security token or token expired',
  INVALID_INPUT_TXN_TYPE: 'Invalid Input: "txn_type" :',
  INVALID_INPUT_BILLING_PROGRAM_ID: 'Invalid input: "billingProgramId".',
  INVALID_VERSION: 'Invalid input: "billingProgramId".',
  CALLER_AUTH_FAILED: 'Caller authentication failed.',
  MISSING_APPAUTHKEY: 'Missing parameter: "appAuthKey".',
  MISSING_BILLING_PROGRAM_ID: 'Missing parameter: "billingProgramId".',
  MISSING_VERSION: 'Missing parameter: "version".',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_DELETED: 'Session Deleted',
  MISSING_CURRENCY: 'missing currency',
  MISSING_SESSION_TYPE: 'Missing required field sessionType',
  MISSING_TXNTYPE: 'Missing parameter: "txnType".'
};
