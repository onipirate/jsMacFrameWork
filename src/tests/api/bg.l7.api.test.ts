import { expect } from 'chai';
import { ExecuteRequest } from '../../common/api/BaseResponse';
import { method } from '../../common/api/APIConstants';
import RequestConfigBuilder from '../../common/api/RequestConfig';
import {
  cancelCreditCardAuthPayload,
  collectPaymentPayload,
  creditCardAuthPayload,
  getTransactionByIdPayload,
  refundl7Payload,
  securityTokenPayload
} from '../../resources/data/BGPayloads';
import { headers } from '../../resources/connections/APIConnections';
import { hostname } from '../../common/api/APIConstants';
import MySQL from '../../common/database/MySQL';
import { BGUSConnectionOptions } from '../../resources/connections/DBConnections';

//hostname
const BG_L7_US_HOST = hostname.BG_L7_US_HOST;

let db: MySQL, transactionId: string, authId: string;
describe('BG L7 APIs Smoke Tests', async () => {
  before(async () => {
    db = new MySQL(BGUSConnectionOptions);
    await db.connect();
  });

  after(async () => {
    await db.disconnect();
  });

  it('Get Security Token Endpoint', async () => {
    //prepare request config
    const securityTokenEndpoint = '/billinggateway/v3/getSecurityToken';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
      .setData(securityTokenPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    const sessionId = res.data.getSecurityTokenResponse.getSecurityTokenResponse.token;

    const dbRes = await db.executeQuery(
      `Select * from BGApplicationSessions where sessionId  ='${sessionId}';`
    );

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode).to.be.equal(
      'BG-0'
    );
    expect(res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg).to.be.equal('OK');
    expect(res.data.getSecurityTokenResponse.getSecurityTokenResponse.status).to.be.equal(
      'Success'
    );

    //validate posted in db
    expect(sessionId, 'Sessions Not Posted in DB').to.be.equal(dbRes.rows[0].sessionId);
  });

  it('Collect Payment Endpoint', async () => {
    //prepare request config
    const collectPaymentEndpoint = '/billinggateway/v3/collectPayment';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_L7_US_HOST + collectPaymentEndpoint) //host + endpoint
      .setData(collectPaymentPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //TransactionId will be use for refund
    transactionId = res.data.collectPaymentResponse.collectPaymentRspn.transactionId;

    const dbRes = await db.executeQuery(
      `Select * from BGPayments where paymentId = '${transactionId}';`
    );

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.data.collectPaymentResponse.collectPaymentRspn.returnCode).to.be.equal('BG-0');
    expect(res.data.collectPaymentResponse.collectPaymentRspn.returnMsg).to.be.equal('OK');
    expect(res.data.collectPaymentResponse.collectPaymentRspn.status).to.be.equal('Success');

    //validate posted in db
    expect(transactionId, 'Payment Not Posted in DB').to.be.equal(dbRes.rows[0].paymentId);
  });

  it('Refund Endpoint', async () => {
    //prepare request config
    const refundEndpoint = '/billinggateway/v3/refund';

    //assign the transactionId from Collect Payment Endpoint to origId
    refundl7Payload.refund.refundReq.origId = transactionId;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_L7_US_HOST + refundEndpoint) //host + endpoint
      .setData(refundl7Payload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    const vendorReference = res.data.refundResponse.refundRspn.vendorTxnId;

    const dbRes = await db.executeQuery(
      `Select * from BGRefunds where vendorReference = '${vendorReference}';`
    );

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.data.refundResponse.refundRspn.returnCode).to.be.equal('BG-0');
    expect(res.data.refundResponse.refundRspn.returnMsg).to.be.equal('OK');
    expect(res.data.refundResponse.refundRspn.status).to.be.equal('Success');

    // validate posted in db
    expect(transactionId, 'Refunds Not Posted in DB').to.be.equal(dbRes.rows[0].paymentId);
  });

  it('Credit Card Auth Endpoint', async () => {
    //prepare request config
    const creditCardAuthEndpoint = '/billinggateway/v3/creditCardAuth';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_L7_US_HOST + creditCardAuthEndpoint) //host + endpoint
      .setData(creditCardAuthPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //will be use for cancel
    authId = res.data.creditCardAuthResponse.creditCardAuthRspn.transactionId;

    const dbRes = await db.executeQuery(`Select * from BGAuths where authId  = '${authId}';`);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.data.creditCardAuthResponse.creditCardAuthRspn.returnCode).to.be.equal('BG-0');
    expect(res.data.creditCardAuthResponse.creditCardAuthRspn.returnMsg).to.be.equal('OK');
    expect(res.data.creditCardAuthResponse.creditCardAuthRspn.status).to.be.equal('Success');

    //validate posted in db
    expect(authId, 'Auths Not Posted in DB').to.be.equal(dbRes.rows[0].authId);
  });

  it('Get Transaction By ID Endpoint', async () => {
    //prepare request config
    const getTransactionByIdEndpoint = '/billinggateway/v3/getTransactionById';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
      .setData(getTransactionByIdPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    const sessionId =
      res.data.getTransactionByIdResponse.getTransactionByIdRspn.transactionDetailList
        .ArrayOfBillingTransactionDetailItem.transaction_id;
    const dbRes = await db.executeQuery(
      `Select * from BGApplicationSessions where sessionId  ='${sessionId}';`
    );

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code).to.be.equal(
      'BG-0'
    );
    expect(res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message).to.be.equal(
      'OK'
    );
    expect(res.data.getTransactionByIdResponse.getTransactionByIdRspn.status).to.be.equal(
      'Success'
    );

    //validate posted in db
    expect(sessionId, 'Sessions Not Posted in DB').to.be.equal(dbRes.rows[0].sessionId);
  });

  //TODO - Update payload to make a successful response
  it('Cancel Credit Card Auth Endpoint', async () => {
    //prepare request config
    const cancelCreditCardAuthEndpoint = '/billinggateway/v3/cancelCreditCardAuth';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_L7_US_HOST + cancelCreditCardAuthEndpoint) //host + endpoint
      .setData(cancelCreditCardAuthPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(200);

    //TODO
    // expect(res.data.cancelCreditCardAuthResponse.cancelCreditCardAuthRspn.returnCode).to.be.equal('BG-0');
    // expect(res.data.cancelCreditCardAuthResponse.cancelCreditCardAuthRspn.returnMsg).to.be.equal('OK');
    // expect(res.data.cancelCreditCardAuthResponse.cancelCreditCardAuthRspn.status).to.be.equal('Success');
  });
});
