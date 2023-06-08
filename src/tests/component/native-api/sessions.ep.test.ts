import { expect } from 'chai';
import { ExecuteRequest } from '../../../common/api/BaseResponse';
import { method, dataStatus, statusText, errorMessage } from '../../../common/api/APIConstants';
import RequestConfigBuilder from '../../../common/api/RequestConfig';
import {
  sessionsIdResponseSchema,
  sessionsIdResponseDeletedSchema,
  sessionsResponseSchema,
  applicationSessionsSchema
} from '../../../resources/data/BGResponseSchema';
import { sessionsPayload } from '../../../resources/data/BGPayloads';
import { hostname } from '../../../common/api/APIConstants';
import { headers } from '../../../resources/connections/APIConnections';
import _ from 'lodash';
import chai from 'chai';
import { getApplicationName } from '../../../resources/api/APIHelpers';
import chaiJsonSchema from 'chai-json-schema';
import Chance from 'chance';
const chance = new Chance();
chai.use(chaiJsonSchema);

const BG_V3_US_HOST = hostname.BG_V3_US_HOST;
let applicationName: string,
  sessionID: string,
  sessionsEndpoint: string,
  sessionsIdEndpoint: string,
  appSessions;
const directApiHeaders = _.omit(headers, [
  'Asurion-apikey',
  'Asurion-correlationid',
  'Asurion-client',
  'Asurion-region',
  'Asurion-channel',
  'Asurion-lineofbusiness',
  'Asurion-enduser',
  'Asurion-enduserdomain'
]);

describe('Sessions Endpoint Validations', async () => {
  before(async () => {
    applicationName = await getApplicationName();
    sessionsEndpoint = `/qa/applications/${applicationName}/sessions`;
  });

  describe('Happy Path of Session Endpoint', async () => {
    it('POST - Create a session for the application - POST OK Response Schema Validation', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(directApiHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      sessionID = res.data.sessionId;
      sessionsIdEndpoint = sessionsEndpoint + `/${sessionID}`;
      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(sessionsIdResponseSchema);
      expect(res.status, 'Incorrect Response Status').to.be.equal(201);
      expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.ACTIVE);
    });

    it('GET all sessions for that application - GET OK Response Schema Validation', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.GET)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(directApiHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(sessionsResponseSchema);
      appSessions = res.data.applicationSessions;
      expect(appSessions.length).to.be.greaterThanOrEqual(1);
      expect(appSessions[0], 'Incorrect Application Sessions Object').to.be.jsonSchema(
        applicationSessionsSchema
      );
    });

    it('GET the specific session for the application - GET OK Response Schema Validation', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.GET)
        .setUrl(BG_V3_US_HOST + sessionsIdEndpoint)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);

      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(sessionsIdResponseSchema);
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(res.data.sessionId, 'Incorrect sessionId in GET').to.be.equal(sessionID);
      expect(res.data.id, 'Incorrect Id in GET').to.be.equal(sessionID);
    });

    it('Delete session ID created for the application -  Delete OK Response Schema Validation', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.DELETE)
        .setUrl(BG_V3_US_HOST + sessionsIdEndpoint)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(
        sessionsIdResponseDeletedSchema
      );
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.DELETED);
    });
  });

  describe('Negatve Scenarios for Session Endpoint', async () => {
    it('Delete Application Name is invalid or not found - Not Found 404', async () => {
      const sessionsEndpoint = `/qa/applications/${chance.guid()}/sessions`;
      const sessionsIdEndpoint = sessionsEndpoint + `/${chance.guid()}`;
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.DELETE)
        .setUrl(BG_V3_US_HOST + sessionsIdEndpoint)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(404);
      expect(res.data.code, 'Incorrect Response Data Code').to.be.equal(404);
      expect(res.data.message, 'Incorrect Response Data Message').to.be.equal(statusText.NOT_FOUND);
    });

    it('Delete Invalid session ID - Not Found 404', async () => {
      const sessionsIdEndpoint = sessionsEndpoint + `/${chance.guid()}`;
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.DELETE)
        .setUrl(BG_V3_US_HOST + sessionsIdEndpoint)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(404);
      expect(res.data.code, 'Incorrect Response Data Code').to.be.equal(404);
      expect(res.data.message, 'Incorrect Response Data Message').to.be.equal(statusText.NOT_FOUND);
    });

    it('Delete session ID that is already deleted - 404', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.DELETE)
        .setUrl(BG_V3_US_HOST + sessionsIdEndpoint)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(404);
      expect(res.data.code, 'Incorrect Response Data Code').to.be.equal(404);
      expect(res.data.message, 'Incorrect Response Data Message').to.be.equal(statusText.NOT_FOUND);
    });

    it('Delete - Unauthorized Request Validation', async () => {
      const omitHeaders = _.omit(directApiHeaders, []);
      omitHeaders['Authorization'] = `Basic ${chance.guid()}`;
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.DELETE)
        .setUrl(BG_V3_US_HOST + sessionsIdEndpoint)
        .setHeaders(omitHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(401);
      expect(res.data.code, 'Incorrect Payload Response Code').to.be.eq(401);
      expect(res.data.message, 'Incorrect Payload Response Message').to.be.eq(
        errorMessage.INVALID_CREDENTIALS
      );
    });

    it('GET deleted sessions of an application', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.GET)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(directApiHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      appSessions = res.data.applicationSessions;
      expect(appSessions[0].status, 'Incorrect Status should be Deleted').to.be.eq(
        dataStatus.DELETED
      );
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
    });

    it('GET a Deleted Session ID', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.GET)
        .setUrl(BG_V3_US_HOST + sessionsIdEndpoint)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(404);
      expect(res.data.code, 'Incorrect Response Code').to.be.equal(404);
      expect(res.data.message, 'Incorrect Response Message').to.be.equal(
        errorMessage.SESSION_DELETED
      );
    });
    it('GET - Application Name is Invald for getting the Session', async () => {
      const sessionsEndpoint = `/qa/applications/${chance.guid()}/sessions`;
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.GET)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(directApiHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.applicationSessions.length,
        'No applications Sessions should be returned'
      ).to.be.eq(0);
    });

    it('GET - Unauthorized Request Validation', async () => {
      const omitHeaders = _.omit(directApiHeaders, []);
      omitHeaders['Authorization'] = `Basic ${chance.guid()}`;
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.GET)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(omitHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(401);
      expect(res.data.code, 'Incorrect Payload Responde Code').to.be.eq(401);
      expect(res.data.message, 'Incorrect Payload Responde Message').to.be.eq(
        errorMessage.INVALID_CREDENTIALS
      );
    });

    it('POST but used PUT -  Method Not Allowed Validation', async () => {
      const cloneHeaders = _.cloneDeep(directApiHeaders);

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.PUT)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(cloneHeaders)
        .build();

      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect status code').to.be.eql(405);
      expect(res.data, 'Incorrect Message').to.be.equal(statusText.METHOD_NOT_ALLOWED);
    });

    xit('POST - Added fields in the payload should not be allowed', async () => {
      const cloneHeaders = _.cloneDeep(directApiHeaders);
      const clonePayLoad = _.set(sessionsPayload, 'addedpayload', 'invalidpayload');

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(clonePayLoad)
        .setHeaders(cloneHeaders)
        .build();

      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.eq(res.status);
    });
    it('POST -  Invalid Headers Validation - BAD REQUEST', async () => {
      const omitHeaders = _.omit(directApiHeaders, ['Accept']);
      omitHeaders['Content-Type'] = 'application/pdf';
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(omitHeaders)
        .build();

      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Response Status').to.be.equal(400);
      expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.BAD_REQUEST);
    });

    it('POST - Unauthorized Request Validation - status 401 UNAUTHORIZED', async () => {
      //prepare request config
      const omitHeaders = _.omit(directApiHeaders, ['Authorization']);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(omitHeaders)
        .build();
      //execute request
      const res = await ExecuteRequest(requestConfig);
      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(401);
      expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.UNAUTHORIZED);
    });

    it('POST - Application Name is Invalid for creation of Session', async () => {
      const sessionsEndpoint = `/qa/applications/${chance.guid()}/sessions`;
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(sessionsPayload)
        .setHeaders(directApiHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      expect(res.status, 'Incorrect Response Status').to.be.equal(500);
      expect(res.data.code, 'Incorrect Response Code').to.be.equal(500);
    });

    it('POST - eCheck Session Creation', async () => {
      const applicationName = await getApplicationName();
      const sessionsEndpoint = `/qa/applications/${applicationName}/sessions`;
      const clonePayload = _.set(sessionsPayload, 'cancelAfterMinutes', 180);
      clonePayload['billingProgramId'] = 'TEST-INGENICO-US';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(clonePayload)
        .setHeaders(directApiHeaders)
        .build();

      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(201);
      expect(res.data.vendorName, 'Vendor Name should be ingenico').to.be.eql('ingenico');
      expect(res.data.status, 'Status should be Active').to.be.eql(dataStatus.ACTIVE);
      expect(res.data.billingToken.length).to.be.eql(15);
      expect(res.data.sessionId.length).to.be.greaterThan(0);
    });

    it('POST - Invalid Field Billing Program ID', async () => {
      const clonePayload = _.cloneDeep(sessionsPayload);
      clonePayload.billingProgramId = 'UNDEFINED-BILLING-PROGRAM';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(clonePayload)
        .setHeaders(directApiHeaders)
        .build();

      const res = await ExecuteRequest(requestConfig);

      expect(res.status, 'Incorrect Status Code').to.be.eql(404);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(404);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(statusText.NOT_FOUND);
    });

    it('POST - Invalid Field sessionType', async () => {
      const clonePayload = _.cloneDeep(sessionsPayload);
      clonePayload.sessionType = 'UNDEFINED-SESSION-TYPE';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(clonePayload)
        .setHeaders(directApiHeaders)
        .build();

      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(
        errorMessage.MISSING_SESSION_TYPE
      );
    });

    it('POST - Invalid Field SourceDetails PaymentAmount Currency', async function () {
      const clonePayload = _.cloneDeep(sessionsPayload);
      clonePayload.sourceDetails.paymentAmount.currency = 'XYZ';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(clonePayload)
        .setHeaders(directApiHeaders)
        .build();

      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(
        `Unsupported currency: ${clonePayload.sourceDetails.paymentAmount.currency}`
      );
    });

    it('POST - Missing Field Billing Program ID', async () => {
      const omitPayload = _.omit(sessionsPayload, ['billingProgramId']);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(omitPayload)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(
        `incorrect field: 'billingProgramId', please check again!`
      );
    });

    it('POST - Missing Field sessionType', async () => {
      const omitPayload = _.omit(sessionsPayload, ['sessionType']);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(omitPayload)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(400);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(
        `incorrect field: 'sessionType', please check again!`
      );
    });

    it('POST - Missing Field SourceDetails', async () => {
      const omitPayload = _.omit(sessionsPayload, 'sourceDetails');
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(omitPayload)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(500);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(500);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(errorMessage.MISSING_CURRENCY);
    });

    it('POST - Missing Field SourceDetails PaymentAmount', async () => {
      const omitPayload = _.cloneDeep(sessionsPayload);
      _.unset(omitPayload, 'sourceDetails.paymentAmount');
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(omitPayload)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(500);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(500);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(errorMessage.MISSING_CURRENCY);
    });

    it('POST - Missing Field SourceDetails PaymentAmount Currency', async () => {
      const omitPayload = _.cloneDeep(sessionsPayload);
      _.unset(omitPayload, 'sourceDetails.paymentAmount.currency');
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_V3_US_HOST + sessionsEndpoint)
        .setData(omitPayload)
        .setHeaders(directApiHeaders)
        .build();
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.eql(500);
      expect(res.data.code, 'Incorrect Status Code').to.be.eql(500);
      expect(res.data.message, 'Incorrect Error Message').to.be.eql(errorMessage.MISSING_CURRENCY);
    });
  });
});
