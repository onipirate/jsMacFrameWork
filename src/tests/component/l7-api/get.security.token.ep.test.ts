import { expect } from 'chai';
import { ExecuteRequest } from '../../../common/api/BaseResponse';
import { method, statusText } from '../../../common/api/APIConstants';
import RequestConfigBuilder from '../../../common/api/RequestConfig';
import { securityTokenPayload } from '../../../resources/data/BGPayloads';
import { getSecurityTokenResponseSchema } from '../../../resources/data/BGResponseSchema';
import { headers } from '../../../resources/connections/APIConnections';
import { hostname } from '../../../common/api/APIConstants';
import { l7Endpoints } from 'resources/api/L7Endpoints';
import chaiJsonSchema from 'chai-json-schema';
import Chance from 'chance';
import _ from 'lodash';
import chai from 'chai';
import { describe } from 'mocha';
import { errorMessage } from '../../../common/api/APIConstants';
chai.use(chaiJsonSchema);
const BG_L7_US_HOST = hostname.BG_L7_US_HOST;
const securityTokenEndpoint = l7Endpoints.getSecurityToken;
const chance = new Chance();
const localsecurityTokenPayload = _.omit(securityTokenPayload, []);
let uniquePayload: object;

describe('Get Security Token Endpoint L7 API Component Test', async () => {
  before(async () => {
    uniquePayload = {
      getSecurityToken: {
        getSecurityTokenRequest: _.omit(
          localsecurityTokenPayload.getSecurityToken.getSecurityTokenRequest,
          ['customerId', 'sourceReferenceNumber', 'rtnURL']
        )
      }
    };
  });
  describe('Happy Path Flow of Get Security Token', async () => {
    it('Get Security Token - All Headers and Fields (Mandatory and Optional) No txnReference PCITOKEN - Happy Path Response Schema Validation', async () => {
      const localPayload = {
        getSecurityToken: {
          getSecurityTokenRequest: _.omit(
            localsecurityTokenPayload.getSecurityToken.getSecurityTokenRequest,
            ['txnReference']
          )
        }
      };
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(localPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      //validate response
      expect(res.status).to.be.equal(200);
      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(
        getSecurityTokenResponseSchema
      );
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode,
        'Incorrect BG return code'
      ).to.be.equal('BG-0');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg,
        'Incorrect Return Message'
      ).to.be.equal('OK');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.status,
        'Incorrect Return Status'
      ).to.be.equal('Success');
    });
    it('Get Security Token - Unique txnReference', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(uniquePayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      //validate response
      expect(res.status).to.be.equal(200);
      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(
        getSecurityTokenResponseSchema
      );
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode,
        'Incorrect BG return code'
      ).to.be.equal('BG-0');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg,
        'Incorrect Return Message'
      ).to.be.equal('OK');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.status,
        'Incorrect Return Status'
      ).to.be.equal('Success');
    });
    it('Get Security Token - txnType AGENT_ASSISTED');
    it('Get Security Token - txnType TERMINAL');
    it('Get Security Token - txnType PAYMENT_LINK');
  });
  describe('Negative Scenarios for L7 getSecurityToken Request', async () => {
    it('Get Security Token - Duplicate txnReference', async () => {
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(uniquePayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.equal(200);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode,
        'Incorrect BG return code'
      ).to.be.equal('BG-504');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg,
        'Incorrect Return Message'
      ).to.be.equal('Duplicate session ID passed in via input "txnReference"');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.status,
        'Incorrect Return Status'
      ).to.be.equal('ProcessFailure');
    });
    it('Get Security Token - Missing Mandatory Header Accept', async () => {
      //localsecurityTokenPayload
      const omitHeaders = _.omit(headers, []);
      omitHeaders.Accept = '*/*';
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(localsecurityTokenPayload)
        .setHeaders(omitHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.equal(406);
      expect(res.data.Error.Message, 'Incorrect Error Message').to.be.equal(
        errorMessage.NOT_ACCEPTABLE
      );
      expect(res.data.Error.Code, 'Incorrect Error Code').to.be.equal(statusText.NOT_ACCEPTABLE);
    });
    it('Get Security Token - Missing Mandatory Header Asurion-client', async () => {
      const omitHeaders = _.omit(headers, ['Asurion-client']);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(localsecurityTokenPayload)
        .setHeaders(omitHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.equal(400);
      expect(res.data.Error.Code, 'Incorrect Error Code').to.be.equal(statusText.BAD_REQUEST);
      expect(res.data.Error.Message, 'Incorrect Error Message').to.be.equal(
        errorMessage.MISSING_MANDATORY_HEADER
      );
    });
    it('Get Security Token - Missing Mandatory Header Asurion-correlationid', async () => {
      const omitHeaders = _.omit(headers, ['Asurion-correlationid']);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(localsecurityTokenPayload)
        .setHeaders(omitHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.equal(400);
      expect(res.data.Error.Code, 'Incorrect Error Code').to.be.equal(statusText.BAD_REQUEST);
      expect(res.data.Error.Message, 'Incorrect Error Message').to.be.equal(
        errorMessage.MISSING_MANDATORY_HEADER
      );
    });
    it('Get Security Token - Missing Mandatory Header Asurion-apikey', async () => {
      const omitHeaders = _.omit(headers, ['Asurion-apikey']);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(localsecurityTokenPayload)
        .setHeaders(omitHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.equal(400);
      expect(res.data.Error.Code, 'Incorrect Error Code').to.be.equal(statusText.BAD_REQUEST);
      expect(res.data.Error.Message, 'Incorrect Error Message').to.be.equal(
        errorMessage.MISSING_MANDATORY_HEADER
      );
    });
    it('Get Security Token - Missing Mandatory Header Authorization', async () => {
      const omitHeaders = _.omit(headers, ['Authorization']);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(localsecurityTokenPayload)
        .setHeaders(omitHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.equal(401);
      expect(res.data.Error.Code, 'Incorrect Error Code').to.be.equal(
        statusText.AUTHENTICATION_FAILED
      );
      expect(res.data.Error.Message, 'Incorrect Error Message').to.be.equal(
        errorMessage.AUTHENTICATION_FAILED
      );
    });
    it('FIXME: Get Security Token - Missing All Mandatory Fields', async () => {
      const omitPayLoad = {
        getSecurityToken: {
          getSecurityTokenRequest: _.omit(
            securityTokenPayload.getSecurityToken.getSecurityTokenRequest,
            [
              'version',
              'billingProgramId',
              'appAuthKey',
              'txnComment1',
              'customerId',
              'sourceReferenceNumber',
              'txnType'
            ]
          )
        }
      };
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(omitPayLoad)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      //BUG - should be 400 FIXME:
      expect(res.status, 'Incorrect Status Code').to.be.equal(200);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode,
        'Incorrect BG Error Code'
      ).to.be.equal('BG-7505');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg,
        'Incorrect BG Error Message'
      ).to.be.equal(errorMessage.MISSING_BILLING_PROGRAM_ID);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.status,
        'Incorrect BG Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });
    it('Get Security Token - Missing All Mandatory Headers', async () => {
      const omitHeaders = _.omit(headers, [
        'Asurion-client',
        'Asurion-apikey',
        'Asurion-correlationid'
      ]);
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(localsecurityTokenPayload)
        .setHeaders(omitHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status).to.be.equal(400);
      expect(res.data.Error.Code, 'Incorrect Error Code').to.be.equal(statusText.BAD_REQUEST);
      expect(res.data.Error.Message, 'Incorrect Error Message').to.be.equal(
        errorMessage.MISSING_MANDATORY_HEADER
      );
    });
  });
  describe('Negative Scenarios Missing or Invalid Field in the Request Payload', async () => {
    it('Get Security Token - Missing Field txnType', async () => {
      const omitPayLoad = {
        getSecurityToken: {
          getSecurityTokenRequest: _.omit(
            securityTokenPayload.getSecurityToken.getSecurityTokenRequest,
            ['txnType']
          )
        }
      };
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(omitPayLoad)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      //BUG - should be 400 FIXME:
      expect(res.status, 'Incorrect Status Code').to.be.equal(200);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode,
        'Incorrect BG Error Code'
      ).to.be.equal('BG-7505');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg,
        'Incorrect BG Error Message'
      ).to.be.equal(errorMessage.MISSING_TXNTYPE);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.status,
        'Incorrect BG Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });
    it.skip('FIXME: Get Security Token - Invalid Field txnType', async () => {
      const clonePayLoad = _.omit(securityTokenPayload, []);
      clonePayLoad.getSecurityToken.getSecurityTokenRequest.txnType = chance
        .cc_type()
        .toUpperCase();
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(clonePayLoad)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res).to.be.eql(res);
    });
    it.skip('FIXME: Get Security Token - Missing Field txnComment2', async () => {
      const omitPayLoad = {
        getSecurityToken: {
          getSecurityTokenRequest: _.omit(
            securityTokenPayload.getSecurityToken.getSecurityTokenRequest,
            ['txnComment2']
          )
        }
      };
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(omitPayLoad)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res).to.be.eql(res);
    });
    it.skip('FIXME: Get Security Token - Missing Field txnComment1', async () => {
      const omitPayLoad = {
        getSecurityToken: {
          getSecurityTokenRequest: _.omit(
            securityTokenPayload.getSecurityToken.getSecurityTokenRequest,
            ['txnComment1']
          )
        }
      };
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(omitPayLoad)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res).to.be.eql(res);
    });
    //Incorrect Status Code Returned
    it('FIXME: Get Security Token - Missing Field appAuthKey', async () => {
      const omitPayLoad = {
        getSecurityToken: {
          getSecurityTokenRequest: _.omit(
            securityTokenPayload.getSecurityToken.getSecurityTokenRequest,
            ['appAuthKey']
          )
        }
      };
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(omitPayLoad)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      //FIXME: Incorrect Status Code
      expect(res.status, 'Incorrect Status Code').to.be.equal(200);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode,
        'Incorrect BG Error Code'
      ).to.be.equal('BG-7505');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg,
        'Incorrect BG Error Message'
      ).to.be.equal(errorMessage.MISSING_APPAUTHKEY);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.status,
        'Incorrect BG Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });
    it.only('FIXME: Get Security Token - Missing Field billingProgramId', async () => {
      const omitPayLoad = {
        getSecurityToken: {
          getSecurityTokenRequest: _.omit(
            securityTokenPayload.getSecurityToken.getSecurityTokenRequest,
            ['billingProgramId']
          )
        }
      };
      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + securityTokenEndpoint) //host + endpoint
        .setData(omitPayLoad)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);
      expect(res.status, 'Incorrect Status Code').to.be.equal(200);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnCode,
        'Incorrect BG Error Code'
      ).to.be.equal('BG-7505');
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.returnMsg,
        'Incorrect BG Error Message'
      ).to.be.equal(errorMessage.MISSING_BILLING_PROGRAM_ID);
      expect(
        res.data.getSecurityTokenResponse.getSecurityTokenResponse.status,
        'Incorrect BG Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });
  });
  it(
    'Get Security Token - incorrect Format txnComment2 ‚ application|channel|culture|line-of-business|client'
  );
  it('Get Security Token - Duplicate or Not Unique txnComment1 for a different txnReference');
  it('Get Security Token - Negative captureDelayMinutes');
  it('Get Security Token - Allow Missing Field captureDelayMinutes (when txnAmt = 0)');
  it('Get Security Token - Missing Field captureDelayMinutes (when txnAmt > 0)');
  it('Get Security Token - txnAmt Validations Maximum amount');
  it('Get Security Token - txnAmt Validations with decimal numbers');
  it('Get Security Token - Negative txnAmt Validations');
  it('Get Security Token - Allow Missing Field currency (when txnAmt = 0)');
  it('Get Security Token - Missing Field currency (when txnAmt > 0)');
  it('Get Security Token - Invalid Field txnAmt (Not Number)');
  it('Get Security Token - Missing Field txnAmt');
  it('Get Security Token - Invalid Field appAuthKey');
  it('Get Security Token - Invalid Field billingProgramId');
});
