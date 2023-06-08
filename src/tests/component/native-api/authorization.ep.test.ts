import { expect } from 'chai';
import { ExecuteRequest } from '../../../common/api/BaseResponse';
import { method, statusText, dataStatus } from '../../../common/api/APIConstants';
import RequestConfigBuilder from '../../../common/api/RequestConfig';
import { authsAndPaymentsPayload } from '../../../resources/data/BGPayloads';
import { authorizationResponseSchema } from '../../../resources/data/BGResponseSchema';
import { headers } from '../../../resources/connections/APIConnections';
import { hostname } from '../../../common/api/APIConstants';
import { getApplicationName } from '../../../resources/api/APIHelpers';
import chai from 'chai';
import chaiJsonSchema from 'chai-json-schema';
chai.use(chaiJsonSchema);

//hostname
const BG_V3_US_HOST = hostname.BG_V3_US_HOST;
let applicationName: string;
describe('Authorization Endpoint Validations', async () => {
  before(async () => {
    applicationName = await getApplicationName();
    //TODO : getBillingToken
  });

  it('Mandatory and Optional Payload Fields Validation - POST status 200 OK', async () => {
    //prepare request config
    //TODO: Update the billingToken
    const authsEndpoint = `/qa/applications/${applicationName}/tokens/h1qaeotiovjt201zzpgtr72pp3exx1/auths`;

    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl(BG_V3_US_HOST + authsEndpoint) //host + endpoint
      .setData(authsAndPaymentsPayload)
      .setHeaders(headers)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    //Schema Validation
    expect(res.data, 'Incorrect Response Schema').to.be.jsonSchema(authorizationResponseSchema);
    expect(res.status, 'Incorrect Response Status').to.be.equal(200);
    expect(res.statusText, 'Incorrect Response Status Text').to.be.equal(statusText.OK);
    expect(res.data.status, 'Incorrect Response Data Status').to.be.equal(dataStatus.SUCCESS);
  });
});
