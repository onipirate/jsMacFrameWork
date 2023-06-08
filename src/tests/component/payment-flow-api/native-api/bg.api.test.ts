import { expect } from 'chai';
import { ExecuteRequest } from '../../../../common/api/BaseResponse';
import { method, statusText, dataStatus } from '../../../../common/api/APIConstants';
import RequestConfigBuilder from '../../../../common/api/RequestConfig';
import {
  appsPayload,
  authsAndPaymentsPayload,
  cancelPayload,
  refundPayload,
  sessionsEcheckPayload,
  sessionsPayload,
  tokensEcheckPayload,
  tokensPayload
} from '../../../../resources/data/BGPayloads';
import { headers } from '../../../../resources/connections/APIConnections';
import { hostname } from '../../../../common/api/APIConstants';

//hostname
const BG_V3_US_HOST = hostname.BG_V3_US_HOST;

let sessionId: string, paymentId: string, authId: string, refundId: string;
describe('BG APIs Smoke Tests', async () => {
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

    //validate response
    expect(res.status).to.be.equal(201);
    expect(res.statusText).to.be.equal(statusText.CREATED);
    expect(res.data.status).to.be.equal(dataStatus.ACTIVE);
  });

  it('GET Applications Endpoint', async () => {
    //prepare request config
    const applicationsEndpoint = `/qa/applications/${appsPayload.name}`;

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
    const sessionsEndpoint = `/qa/applications/${appsPayload.name}/sessions`;

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

    //validate response
    expect(res.status).to.be.equal(201);
    expect(res.statusText).to.be.equal(statusText.CREATED);
  });

  it('GET Sessions Endpoint', async () => {
    //prepare request config
    const sessionsEndpoint = `/qa/applications/${appsPayload.name}/sessions/${sessionId}`;

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
    const tokensEndpoint = `/qa/applications/${appsPayload.name}/sessions/${sessionId}/tokens`;

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
    //const authsEndpoint = `/qa/applications/${appsPayload.name}/tokens/${token}/auths`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const authsEndpoint = `/qa/applications/${appsPayload.name}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/auths`;

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

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);
  });

  it('GET Auths Endpoint', async () => {
    //prepare request config
    //const authsEndpoint = `/qa/applications/${appsPayload.name}/tokens/${token}/auths`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const authsEndpoint = `/qa/applications/${appsPayload.name}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/auths/${authId}`;

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
    //const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/${token}/payments`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments`;

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

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);
  });

  it('GET Payments Endpoint', async () => {
    //prepare request config
    //const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/${token}/payments`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments/${paymentId}`;

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
    // const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/${token}/payments/${paymentId}/refunds`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments/${paymentId}/refunds`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + paymentsEndpoint) //host + endpoint
      .setData(refundPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    refundId = res.data.refundId;

    //validate response
    expect(res.status).to.be.equal(200);
    expect(res.statusText).to.be.equal(statusText.OK);
    expect(res.data.status).to.be.equal(dataStatus.SUCCESS);
  });

  it('GET Refund Endpoint', async () => {
    //prepare request config
    // const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/${token}/payments/${paymentId}/refunds`;
    //TODO: retrieve token - applicationPaymentTokenId from Tokens Endpoint Response
    const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/payments/${paymentId}/refunds/${refundId}`;

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
    const paymentsEndpoint = `/qa/applications/${appsPayload.name}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/auths/${authId}/cancel`;

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
  });

  it('Sessions E-Check Endpoint', async () => {
    //prepare request config
    const sessionsEndpoint = `/qa/applications/${appsPayload.name}/sessions`;

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
    const tokensEndpoint = `/qa/applications/${appsPayload.name}/sessions/${sessionId}/tokens`;

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
