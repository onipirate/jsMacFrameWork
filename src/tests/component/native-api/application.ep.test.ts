/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { ExecuteRequest } from '../../../common/api/BaseResponse';
import { method, statusText, dataStatus } from '../../../common/api/APIConstants';
import RequestConfigBuilder from '../../../common/api/RequestConfig';
import { appsPayload } from '../../../resources/data/BGPayloads';
import { applicationsResponseSchema } from '../../../resources/data/BGResponseSchema';
import { headers } from '../../../resources/connections/APIConnections';
import { hostname } from '../../../common/api/APIConstants';
import _ from 'lodash';
import * as Chance from 'chance';
const chance = Chance.default();
import chai from 'chai';
import chaiJsonSchema from 'chai-json-schema';
chai.use(chaiJsonSchema);

//hostname
const BG_V3_US_HOST = hostname.BG_V3_US_HOST;
let applicationName: string;
describe('Applications Endpoint Validations', async () => {
  it('POST - Mandatory and Optional Payload Fields Validation - status 201 CREATED', async () => {
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
    applicationName = res.data.name;

    //validate response
    //Schema Validation
    expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(applicationsResponseSchema);
    expect(res.status, 'Incorrect Response Status').to.be.equal(201);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.CREATED);
    expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.ACTIVE);
  });

  it('POST - Mandatory Fields Validation - status 201 CREATED', async () => {
    //prepare request config
    const applicationsEndpoint = '/qa/applications';

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

    //update app name to avoid duplicate name
    appsPayload.name = `${appsPayload.name}${chance.integer()}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setData(appsPayload)
      .setHeaders(omitOptionalHeaders)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(201);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.CREATED);
    expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.ACTIVE);
  });

  //TODO: Confirm with DEV
  xit('POST - Missing Mandatory Headers Validation - status 400 BAD_REQUEST', async () => {
    //prepare request config
    const applicationsEndpoint = '/qa/applications';

    //omit some mandatory and optional headers
    const omitHeaders = _.omit(headers, [
      'Asurion-apikey',
      'Asurion-client',
      'Asurion-correlationid',
      'Accept',
      'Content-Type',
      'Asurion-region',
      'Asurion-lineofbusiness',
      'Asurion-channel',
      'Asurion-enduser',
      'Asurion-enduserdomain'
    ]);

    //update app name to avoid duplicate name
    appsPayload.name = `${appsPayload.name}${chance.integer()}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setData(appsPayload)
      .setHeaders(omitHeaders)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(400);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.BAD_REQUEST);
  });

  it('POST - Missing Payload Mandatory Field Validation - status 400 BAD_REQUEST', async () => {
    //prepare request config
    const applicationsEndpoint = '/qa/applications';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(400);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.BAD_REQUEST);

    //Better if message would be missing mandatory field.
    expect(res.data.message).to.be.equal(`incorrect field: 'name', please check again!`);
  });

  it('POST - Unauthorized Request Validation - status 401 UNAUTHORIZED', async () => {
    //prepare request config
    const applicationsEndpoint = '/qa/applications';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setData(appsPayload)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(401);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.UNAUTHORIZED);
  });

  //TODO: Confirm with DEV - it is timing out endpoint is for POST but use GET method.
  xit('POST - Not Allowed Method Validation - status 405 METHOD_NOT_ALLOWED', async () => {
    //prepare request config
    const applicationsEndpoint = '/qa/applications';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setData(appsPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(405);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(
      statusText.METHOD_NOT_ALLOWED
    );
  });

  it('GET - Mandatory and Optional Fields Validation - status 200 OK', async () => {
    //prepare request config
    const applicationsEndpoint = `/qa/applications/${applicationName}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    //Schema Validation
    expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(applicationsResponseSchema);
    expect(res.status, 'Incorrect Response Status').to.be.equal(200);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.OK);
    expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.ACTIVE);
  });

  it('GET - Mandatory Fields Validation - status 200 OK', async () => {
    //prepare request config
    const applicationsEndpoint = `/qa/applications/${applicationName}`;

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

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setHeaders(omitOptionalHeaders)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(200);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.OK);
    expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.ACTIVE);
  });

  it('GET - Invalid Application Name Validation - status 404 NOT_FOUND', async () => {
    //prepare request config
    const invalidAppName = `invalidAppName${chance.integer()}`;
    const applicationsEndpoint = `/qa/applications/${invalidAppName}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(404);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.NOT_FOUND);
  });

  it('GET - Unauthorized Request Validation - status 401 UNAUTHORIZED', async () => {
    //prepare request config
    const invalidAppName = `invalidAppName${chance.integer()}`;
    const applicationsEndpoint = `/qa/applications/${invalidAppName}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.GET)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(401);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.UNAUTHORIZED);
  });

  it('GET - Incorrect Method Validation - status 405 MMETHOD_NOT_ALLOWEDMETHOD_NOT_ALLOWED', async () => {
    //prepare request config
    const invalidAppName = `invalidAppName${chance.integer()}`;
    const applicationsEndpoint = `/qa/applications/${invalidAppName}`;

    //Use POST instead of GET
    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(405);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(
      statusText.METHOD_NOT_ALLOWED
    );
  });

  xit('POST - Unrecognized Field in Payload Validation - status 201 CREATED', async () => {
    //prepare request config
    const applicationsEndpoint = '/qa/applications';

    //update app name to avoid duplicate name
    appsPayload.name = `${appsPayload.name}${chance.integer()}`;

    //Update payload to add unrecognized field
    const invalidPayload: any = appsPayload;
    invalidPayload.invalidField = 'invalidFieldValue';

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setData(invalidPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    //Schema Validation
    expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(applicationsResponseSchema);
    expect(res.status, 'Incorrect Response Status').to.be.equal(201);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.CREATED);
    expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.ACTIVE);
  });

  it('DELETE - Mandatory and Optional Fields Validation - status 204 NO_CONTENT', async () => {
    //prepare request config
    const applicationsEndpoint = `/qa/applications/${applicationName}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.DELETE)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(204);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.NO_CONTENT);
  });

  xit('DELETE - Not Found Application Name Validation - status 404 NOT_FOUND', async () => {
    //prepare request config
    const notFoundApplicationName = `${applicationName}${chance.integer()}`;
    const applicationsEndpoint = `/qa/applications/${notFoundApplicationName}`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.DELETE)
      .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res.status, 'Incorrect Response Status').to.be.equal(404);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.NOT_FOUND);
  });
});
