import { expect } from 'chai';
import { ExecuteRequest } from '../../common/api/BaseResponse';
import { method, statusText, dataStatus } from '../../common/api/APIConstants';
import RequestConfigBuilder from '../../common/api/RequestConfig';
import {
  appsPayload,
  authsAndPaymentsPayload,
  cancelPayload,
  refundPayload,
  sessionsEcheckPayload,
  sessionsPayload,
  tokensEcheckPayload,
  tokensPayload
} from '../../resources/data/BGPayloads';
import { headers } from '../../resources/connections/APIConnections';
import { hostname } from '../../common/api/APIConstants';
import MySQL from '../../common/database/MySQL';
import { BGUSConnectionOptions } from '../../resources/connections/DBConnections';
import Allure from '../../resources/utils/Allure';

//hostname
const BG_V3_US_HOST = hostname.BG_V3_US_HOST;

let db: MySQL,
  appName: string,
  sessionId: string,
  paymentId: string,
  authId: string,
  refundId: string;
describe('BG APIs Smoke Tests', async () => {
  before(async () => {
    db = new MySQL(BGUSConnectionOptions);
    await db.connect();
  });

  after(async () => {
    await db.disconnect();
  });

  it('POST Applications Endpoint', async () => {
    //prepare request config
    const applicationsEndpoint = '/qa/applications';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setData(appsPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //application name
    appName = res.data.name;

    const dbRes = await db.executeQuery(
      `Select * from BGApplications WHERE name = '${res.data.name}';`
    );

    //validate response
    expect(res.status).to.be.equal(201);
    expect(res.statusText).to.be.equal(statusText.CREATED);

    //validate posted in db
    expect(appName, 'App Name Not Posted in DB').to.be.equal(dbRes.rows[0].name);
  });

  it('GET Applications Endpoint', async () => {
    //prepare request config
    const applicationsEndpoint = `/qa/applications/${appName}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
  });

  it('POST Sessions Endpoint', async () => {
    //prepare request config
    const sessionsEndpoint = `/qa/applications/${appName}/sessions`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + sessionsEndpoint) //host + endpoint
      .setData(sessionsPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //sessionId to be use in tokens endpoint
    sessionId = res.data.sessionId;

    const dbRes = await db.executeQuery(
      `Select * from BGApplicationSessions where sessionId  ='${sessionId}';`
    );

    //validate response
    expect(res.status).to.be.equal(201);
    expect(res.statusText).to.be.equal(statusText.CREATED);

    //validate posted in db
    expect(sessionId, 'Sessions Not Posted in DB').to.be.equal(dbRes.rows[0].sessionId);
  });

  it('GET Sessions Endpoint', async () => {
    //prepare request config
    const sessionsEndpoint = `/qa/applications/${appName}/sessions/${sessionId}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + sessionsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
  });

  //TODO: Update tokens payload retrieve encryptedCustomerInput on runtime.
  xit('Tokens Endpoint', async () => {
    //prepare request config
    const tokensEndpoint = `/qa/applications/${appName}/sessions/${sessionId}/tokens`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + tokensEndpoint) //host + endpoint
      .setData(tokensPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);
    //TODO : save applicationPaymentTokenId
    //token = res.data.applicationPaymentTokenId;

    //validate response
    expect(res.status).to.be.equal(201);
    expect(res.statusText).to.be.equal(statusText.CREATED);
  });

  it('POST Auths Endpoint', async () => {
    //prepare request config
    //const authsEndpoint = `/qa/applications/${appName}/tokens/${token}/auths`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const authsEndpoint = `/qa/applications/${appName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/auths`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + authsEndpoint) //host + endpoint
      .setData(authsAndPaymentsPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //will be use for cancel
    authId = res.data.authId;

    const dbRes = await db.executeQuery(`Select * from BGAuths where authId  = '${authId}';`);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);

    //validate posted in db
    expect(authId, 'Auths Not Posted in DB').to.be.equal(dbRes.rows[0].authId);
  });

  it('GET Auths Endpoint', async () => {
    //prepare request config
    //const authsEndpoint = `/qa/applications/${appName}/tokens/${token}/auths`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const authsEndpoint = `/qa/applications/${appName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/auths/${authId}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + authsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);
  });

  it('POST Payments Endpoint', async () => {
    //prepare request config
    //const paymentsEndpoint = `/qa/applications/${appName}/tokens/${token}/payments`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + paymentsEndpoint) //host + endpoint
      .setData(authsAndPaymentsPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);
    //will be use for refund
    paymentId = res.data.paymentId;

    const dbRes = await db.executeQuery(
      `Select * from BGPayments where paymentId  = '${paymentId}';`
    );

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);

    //validate posted in db
    expect(paymentId, 'Payment Not Posted in DB').to.be.equal(dbRes.rows[0].paymentId);
  });

  it('GET Payments Endpoint', async () => {
    //prepare request config
    //const paymentsEndpoint = `/qa/applications/${appName}/tokens/${token}/payments`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments/${paymentId}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + paymentsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);
  });

  it('POST Refund Endpoint', async () => {
    //prepare request config
    // const paymentsEndpoint = `/qa/applications/${appName}/tokens/${token}/payments/${paymentId}/refunds`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments/${paymentId}/refunds`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + paymentsEndpoint) //host + endpoint
      .setData(refundPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    refundId = res.data.refundId;

    const dbRes = await db.executeQuery(`Select * from BGRefunds where refundId  = '${refundId}';`);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);

    //validate posted in db
    expect(refundId, 'Refunds Not Posted in DB').to.be.equal(dbRes.rows[0].refundId);
  });

  it('GET Refund Endpoint', async () => {
    //prepare request config
    // const paymentsEndpoint = `/qa/applications/${appName}/tokens/${token}/payments/${paymentId}/refunds`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments/${paymentId}/refunds/${refundId}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + paymentsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUBMITTED_REFUND);
  });

  it('POST Cancel Endpoint', async () => {
    //prepare request config
    const paymentsEndpoint = `/qa/applications/${appName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/auths/${authId}/cancel`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + paymentsEndpoint) //host + endpoint
      .setData(cancelPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);

    //add polling logic to wait for status to be cancelled
    let retries = 0;
    let dbRes;
    const maxRetries = 10;
    const interval = 60000; // 1 minute in milliseconds
    while (retries < maxRetries) {
      Allure.logStep(`Checking Auths Status - Attempt ${retries + 1} of ${maxRetries} `);
      dbRes = await db.executeQuery(`Select * from BGAuths where authId = '${authId}';`);
      if (dbRes.rows[0].status === 'CANCELLED') {
        break;
      }
      retries++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    //validate posted in db status cancelled
    expect(dbRes?.rows[0].status, 'Incorrect Auths Status').to.be.equal('CANCELLED');
  }).timeout(600000);

  it('Sessions E-Check Endpoint', async () => {
    //prepare request config
    const sessionsEndpoint = `/qa/applications/${appName}/sessions`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + sessionsEndpoint) //host + endpoint
      .setData(sessionsEcheckPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //sessionId to be use in tokens endpoint
    sessionId = res.data.sessionId;

    //validate response
    expect(res.status).to.be.equal(201);
    expect(res.statusText).to.be.equal(statusText.CREATED);
    expect(res.data.status).to.be.equal(dataStatus.ACTIVE);
  });

  it('Tokens E-Check Endpoint', async () => {
    //prepare request config
    const tokensEndpoint = `/qa/applications/${appName}/sessions/${sessionId}/tokens`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + tokensEndpoint) //host + endpoint
      .setData(tokensEcheckPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status).to.be.equal(201);
    expect(res.statusText).to.be.equal(statusText.CREATED);
  });
});
