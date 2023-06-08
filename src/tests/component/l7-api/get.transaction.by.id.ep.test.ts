import { expect } from 'chai';
import { ExecuteRequest } from '../../../common/api/BaseResponse';
import { errorMessage, method, statusText } from '../../../common/api/APIConstants';
import RequestConfigBuilder from '../../../common/api/RequestConfig';
import { getTransactionByIdPayload } from '../../../resources/data/BGPayloads';
import { headers } from '../../../resources/connections/APIConnections';
import { hostname } from '../../../common/api/APIConstants';
import _ from 'lodash';
import { getTransactionByIDResponseSchema } from '../../../resources/data/BGResponseSchema';
import chai from 'chai';
import chaiJsonSchema from 'chai-json-schema';
import { l7Endpoints } from '../../../resources/api/L7Endpoints';
chai.use(chaiJsonSchema);

//hostname
const BG_L7_US_HOST = hostname.BG_L7_US_HOST;

describe('Get Transaction By ID Endpoint', async () => {
  describe('Happy Paths', async () => {
    it('All Headers and Payload Fields Validation - BG-0 Success', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(getTransactionByIdPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      // validate response
      // Schema Validation
      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(
        getTransactionByIDResponseSchema
      );
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-0');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(statusText.OK);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal('Success');
    });

    it('Mandatory and Payload Fields Validation - BG-0 Success', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //omit optional haders
      const omitOptionalHeaders = _.omit(headers, [
        'Accept',
        'Content-Type',
        'Asurion-region',
        'Asurion-lineofbusiness',
        'Asurion-channel',
        'Asurion-enduser',
        'Asurion-enduserdomain'
      ]);

      //omit optional headers
      const omitOptionalPayloadFields = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            getTransactionByIdPayload.getTransactionById.getTransactionByIdReq,
            ['successTxnOnly', 'flexField1', 'flexField2']
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitOptionalPayloadFields)
        .setHeaders(omitOptionalHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      // validate response
      // Schema Validation
      expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(
        getTransactionByIDResponseSchema
      );
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-0');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(statusText.OK);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal('Success');
    });
  });

  describe('Unhappy Paths', async () => {
    it('Missing Mandatory Headers - status 400 BAD_REQUEST', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //omit mandatory haders
      const omitMandatoryHeaders = _.omit(headers, [
        'Asurion-apikey',
        'Asurion-client',
        'Asurion-correlationid'
      ]);

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(getTransactionByIdPayload)
        .setHeaders(omitMandatoryHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(400);
      expect(res.data.Error.Code, 'Incorrect Response Status Text').to.be.equal(
        statusText.BAD_REQUEST
      );
      expect(res.data.Error.Message, 'Incorrect Response Error Message').to.be.equal(
        errorMessage.MISSING_MANDATORY_HEADER
      );
    });

    it('Invalid Accept Header - status 406 NOT_ACCEPTABLE', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //update Accept header
      const newAcceptHeader = _.clone(headers);
      newAcceptHeader.Accept = 'application/pdf';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(getTransactionByIdPayload)
        .setHeaders(newAcceptHeader)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(406);
      expect(res.data.Error.Code, 'Incorrect Response Status Text').to.be.equal(
        statusText.NOT_ACCEPTABLE
      );
      expect(res.data.Error.Message, 'Incorrect Response Error Message').to.be.equal(
        errorMessage.NOT_ACCEPTABLE
      );
    });

    it('Missing Authorization Header - status 401 AUTHENTICATION_FAILED', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //omit mandatory haders Authorization
      const omitMandatoryHeaders = _.omit(headers, ['Authorization']);

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(getTransactionByIdPayload)
        .setHeaders(omitMandatoryHeaders)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(401);
      expect(res.data.Error.Code, 'Incorrect Response Status Text').to.be.equal(
        statusText.AUTHENTICATION_FAILED
      );
      expect(res.data.Error.Message, 'Incorrect Response Error Message').to.be.equal(
        errorMessage.AUTHENTICATION_FAILED
      );
    });

    it('Missing billingProgramId - BG-501 ProcessFailure', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid srcTransactionId
      const cloneInvalidSrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.srcTransactionId =
        '62807028-d40f-4886-8cfb-xxxxxxxxxxxx';

      //Omit billingProgramId
      const omitBillingProgramIdPayload = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq,
            ['billingProgramId']
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitBillingProgramIdPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-501');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal('Missing parameter: "billingProgramId".');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.PROCESS_FAILURE);
    });

    it('Missing transType - BG-7505 Invalid Data', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid srcTransactionId
      const cloneInvalidSrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.srcTransactionId =
        'xxxxxxxxxxxx';

      //Omit transType
      const omitTransTypePayload = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq,
            ['transType']
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitTransTypePayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-7505');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.MISSING_TXN_TYPE);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });

    it('Missing srcTransactionId - BG-7505 Invalid Data', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //Omit appAuthKey
      const omitSrcTransactionIdPayload = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            getTransactionByIdPayload.getTransactionById.getTransactionByIdReq,
            ['srcTransactionId']
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitSrcTransactionIdPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnCode,
        'Incorrect Response Code'
      ).to.be.equal('BG-7505');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnMsg,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.MISSING_SRC_TRANSACTION_ID);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });

    it('Not Found srcTransactionId - BG-2702 ProcessFailure', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set not found srcTransactionId
      const cloneInvalidSrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.srcTransactionId =
        '62807028-d40f-4886-8cfb-xxxxxxxxxxxx';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(cloneInvalidSrcTransactionId)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-2702');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.NO_TRANSACTION_FOUND);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.PROCESS_FAILURE);
    });

    it('Invalid Security Token or Token Expired - BG-902 ProcessFailure', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid or expired srcTransactionId/session ID
      const cloneExpiredSrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneExpiredSrcTransactionId.getTransactionById.getTransactionByIdReq.srcTransactionId =
        '62807028-d40f-4886-8cfb-8bb2b7fe410c';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(cloneExpiredSrcTransactionId)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-902');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.INVALID_SECURITY_TOKEN_OR_TOKEN_EXPIRED);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.PROCESS_FAILURE);
    });

    it('Invalid transType - BG-7506 InvalidData', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid srcTransactionId
      const cloneInvalidrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneInvalidrcTransactionId.getTransactionById.getTransactionByIdReq.srcTransactionId =
        '62807028-d40f-4886-8cfb-xxxxxxxxxxxx';

      //set invalid transType
      cloneInvalidrcTransactionId.getTransactionById.getTransactionByIdReq.transType =
        'xxxxxxxxxxxx';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(cloneInvalidrcTransactionId)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-7506');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.INVALID_INPUT_TXN_TYPE);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });

    it('Invalid billingProgramId - BG-502 ProcessFailure', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid srcTransactionId
      const cloneInvalidSrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.srcTransactionId =
        '62807028-d40f-4886-8cfb-xxxxxxxxxxxx';
      //set invalid billingProgramId
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.billingProgramId =
        'xxxxxxxxxxxx';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(cloneInvalidSrcTransactionId)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-502');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.INVALID_INPUT_BILLING_PROGRAM_ID);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.PROCESS_FAILURE);
    });

    it('Invalid appAuthKey - BG-900 System Error', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid appAuthKey
      const cloneGetTransactionByIdPayload = _.clone(getTransactionByIdPayload);
      cloneGetTransactionByIdPayload.getTransactionById.getTransactionByIdReq.billingProgramId =
        'CONSUMER_CELLULAR-HORIZON-PORTAL-US';
      cloneGetTransactionByIdPayload.getTransactionById.getTransactionByIdReq.transType =
        'pcitoken';
      cloneGetTransactionByIdPayload.getTransactionById.getTransactionByIdReq.srcTransactionId =
        '62807028-d40f-4886-8cfb-8bb2b7fe410b';
      cloneGetTransactionByIdPayload.getTransactionById.getTransactionByIdReq.appAuthKey =
        'xxxxxxxxxxxx';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(cloneGetTransactionByIdPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnCode,
        'Incorrect Response Code'
      ).to.be.equal('BG-900');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnMsg,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.CALLER_AUTH_FAILED);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.SYSTEM_ERROR);
    });

    it('Missing appAuthKey - BG-7505 Invalid Data', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //Omit appAuthKey
      const omitAppAuthKeyPayload = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            getTransactionByIdPayload.getTransactionById.getTransactionByIdReq,
            ['appAuthKey']
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitAppAuthKeyPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnCode,
        'Incorrect Response Code'
      ).to.be.equal('BG-7505');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnMsg,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.MISSING_APPAUTHKEY);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });

    //TODO: Bug
    xit('Invalid Version - BG-7518 Invalid Data', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //Omit Version
      const omitAppAuthKeyPayload = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            getTransactionByIdPayload.getTransactionById.getTransactionByIdReq,
            ['version']
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitAppAuthKeyPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnCode,
        'Incorrect Response Code'
      ).to.be.equal('BG-7518');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnMsg,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.INVALID_VERSION);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });

    //TODO: Bug
    xit('Missing Version - BG-7524 Invalid Data', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //Omit Version
      const omitAppAuthKeyPayload = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            getTransactionByIdPayload.getTransactionById.getTransactionByIdReq,
            ['version']
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitAppAuthKeyPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnCode,
        'Incorrect Response Code'
      ).to.be.equal('BG-7524');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnMsg,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.MISSING_VERSION);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });

    xit('Valid appAuthKey and srcTransactionId only in payload - BG-501 ProcessFailure', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //Omit some fields and retain appAuthKey and srcTransactionId only
      const omitAppAuthKeyPayload = {
        getTransactionById: {
          getTransactionByIdReq: _.omit(
            getTransactionByIdPayload.getTransactionById.getTransactionByIdReq,
            [
              'version',
              'billingProgramId',
              'transType',
              'successTxnOnly',
              'flexField1',
              'flexField2'
            ]
          )
        }
      };

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(omitAppAuthKeyPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      //validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnCode,
        'Incorrect Response Code'
      ).to.be.equal('BG-501');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.returnMsg,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.MISSING_BILLING_PROGRAM_ID);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.PROCESS_FAILURE);
    });

    //TODO: Bug
    xit('Invalid billingProgramId and Valid srcTransactionId - BG-502 ProcessFailure', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid billingProgramId
      const cloneInvalidSrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.billingProgramId =
        'xxxxxxxxxxxx';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(cloneInvalidSrcTransactionId)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      // validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-502');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.INVALID_INPUT_BILLING_PROGRAM_ID);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.PROCESS_FAILURE);
    });

    //TODO: Bug
    xit('Invalid transType and Valid srcTransactionId - BG-7506 InvalidData', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      //set invalid transType
      const cloneInvalidSrcTransactionId = _.clone(getTransactionByIdPayload);
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.transType =
        'xxxxxxxxxxxx';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(getTransactionByIdPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      // validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_code,
        'Incorrect Response Code'
      ).to.be.equal('BG-7506');
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.response_message,
        'Incorrect Response Message'
      ).to.be.equal(errorMessage.INVALID_INPUT_TXN_TYPE);
      expect(
        res.data.getTransactionByIdResponse.getTransactionByIdRspn.status,
        'Incorrect Response Status Text'
      ).to.be.equal(statusText.INVALID_DATA);
    });

    //TODO: Bug
    xit('Payload Fields Max Length Validations', async () => {
      //prepare request config
      const getTransactionByIdEndpoint = l7Endpoints.getTransactionById;

      const cloneInvalidSrcTransactionId = _.clone(getTransactionByIdPayload);
      //set not boolean successTxnOnly
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.successTxnOnly =
        'xxxxxxxxxx';
      //set > 100 chararacters
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.flexField1 =
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
      cloneInvalidSrcTransactionId.getTransactionById.getTransactionByIdReq.flexField2 =
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

      const requestConfig = new RequestConfigBuilder()
        .setMethod(method.POST)
        .setUrl(BG_L7_US_HOST + getTransactionByIdEndpoint) //host + endpoint
        .setData(getTransactionByIdPayload)
        .setHeaders(headers)
        .build();

      //execute request
      const res = await ExecuteRequest(requestConfig);

      // validate response
      expect(res.status, 'Incorrect Response Status').to.be.equal(200);
    });
  });
});
