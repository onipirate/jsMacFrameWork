/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from './BaseRequest';
import axios, { AxiosResponse } from 'axios';
import { RequestConfigFields } from './RequestConfig';
import Allure from '../../resources/utils/Allure';

/**
 * Base response module that takes request options and return response or throws an error if the response status
 * code is not in the 200-299 range.
 * This module also attach the ACTUAL RESPONSE DATA or the RESPONSE ERROR to allure report.
 *
 * @param requestConfig Request Options
 * @returns {Promise<AxiosResponse<any, any>>} - Axios Response Object
 */
export const Response = async (
  requestConfig: RequestConfigFields
): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await Request(requestConfig);
    if (response && response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw response;
    }
  } catch (error: any) {
    Allure.attachment(
      `Error Response Data for ${error.config.url}`,
      JSON.stringify(error.data, null, 2)
    );
    return error;
  }
};

export const ExecuteRequest = async (requestConfig: RequestConfigFields) => {
  return await Response(requestConfig);
};

// Log every response using interceptors.
axios.interceptors.response.use(
  async (res) => {
    Allure.attachment(`Response Data for ${res.config.url}`, JSON.stringify(res.data, null, 2));
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);
