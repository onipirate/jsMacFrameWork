import { ExecuteRequest } from '../../common/api/BaseResponse';
import { method } from '../../common/api/APIConstants';
import RequestConfigBuilder from '../../common/api/RequestConfig';
import { appsPayload } from '../../resources/data/BGPayloads';
import { headers } from '../../resources/connections/APIConnections';
import { hostname } from '../../common/api/APIConstants';

//hostname
const BG_V3_US_HOST = hostname.BG_V3_US_HOST;

export const getApplicationName = async () => {
  const applicationsEndpoint = '/qa/applications';
  const requestConfig = new RequestConfigBuilder()
    .setMethod(method.POST)
    .setUrl(BG_V3_US_HOST + applicationsEndpoint) //host + endpoint
    .setData(appsPayload)
    .setHeaders(headers)
    .build();

  //execute request
  const res = await ExecuteRequest(requestConfig);
  const appName = res.data.name;

  return appName;
};
