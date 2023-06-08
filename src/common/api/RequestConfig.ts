/**
 * @description: Request config options for making a reqest.
 *  Only the url is required.
 *  Requests will default to GET if method is not specified.
 */
export interface RequestConfigFields {
  method: string; //default GET
  url: string; //endpoint URL (note: baseURL depends on environment)
  data?: object; //data to be sent as the request body
  params?: object; //URL parameters to be sent with the request
  headers?: object; //custom headers to be sent
  auth?: object; //HTTP Basic auth and supplies credentials.
  resolveWithFullResponse: boolean; //receive the full IncomingMessage object for the response
  proxy: boolean;
}

export default class RequestConfigBuilder {
  private readonly config: RequestConfigFields;

  constructor() {
    this.config = {
      method: 'GET',
      url: '',
      resolveWithFullResponse: true,
      proxy: false
    };
  }

  public setMethod(method: string): RequestConfigBuilder {
    this.config.method = method;
    return this;
  }

  public setUrl(url: string): RequestConfigBuilder {
    this.config.url = url;
    return this;
  }

  public setData(data: object): RequestConfigBuilder {
    this.config.data = data;
    return this;
  }

  public setParams(params: object): RequestConfigBuilder {
    this.config.params = params;
    return this;
  }

  public setHeaders(headers: object): RequestConfigBuilder {
    this.config.headers = headers;
    return this;
  }

  public setAuth(auth: object): RequestConfigBuilder {
    this.config.auth = auth;
    return this;
  }

  public setResolveWithFullResponse(resolveWithFullResponse: boolean): RequestConfigBuilder {
    this.config.resolveWithFullResponse = resolveWithFullResponse;
    return this;
  }

  public setProxy(proxy: boolean): RequestConfigBuilder {
    this.config.proxy = proxy;
    return this;
  }

  public build(): RequestConfigFields {
    return this.config;
  }
}
