import HorizonAlphaPages from '../../../common/ui/pages/HorizonAlphaPage';
import Allure from '../../../resources/utils/Allure';
import { ExecuteRequest } from '../../../common/api/BaseResponse';
import { method } from '../../../common/api/APIConstants';
import { mdnPayload } from '../../../resources/data/BGPayloads';
import { parseEncodedSecret } from '../../../resources/utils/SecretParser';
import RequestConfigBuilder from '../../../common/api/RequestConfig';
import MySQL from '../../../common/database/MySQL';

const bgAPIheaders = process.env.BG_API_HEADERS as string;

describe('BG First UI, API, DB Tests', () => {
  it('Navigate to horizon alpha welcome page', async () => {
    Allure.logStep('Open Sign In page');
    await HorizonAlphaPages.open();

    Allure.logStep('Enter Credentials and Sign On');
    await HorizonAlphaPages.enterText(
      HorizonAlphaPages.txtUsername,
      process.env.ALPHA_USERNAME as string
    );
    await HorizonAlphaPages.enterText(
      HorizonAlphaPages.txtPassword,
      process.env.ALPHA_PASSWORD as string
    );
    await HorizonAlphaPages.click(HorizonAlphaPages.btnSignOn);

    await expect(HorizonAlphaPages.btnStart).toBeClickable();
  });

  it('Returns a valid response', async () => {
    //prepare request config
    const requestConfig = new RequestConfigBuilder()
      .setMethod(method.POST)
      .setUrl('https://apigw.sqa.asurionapi.com/datastaging/v2/stagemdn/') //host + endpoint
      .setData(mdnPayload)
      .setHeaders(parseEncodedSecret(bgAPIheaders))
      .setResolveWithFullResponse(true)
      .build();

    //execute request
    const res = await ExecuteRequest(requestConfig);

    //validate response
    expect(res?.status).toEqual(200);
  });

  it('Execute a query and return result', async () => {
    //db connect
    const db: MySQL = new MySQL({
      host: 'backoffice-bgtwy-npr-db-usa.backoffice.npr.aws.asurion.net',
      port: 3330,
      user: process.env.BG_DB_US_USERNAME,
      password: process.env.BG_DB_US_PASSWORD,
      database: 'bgqa'
    });
    await db.connect();

    //execute query
    const query = `SELECT * FROM bgqa.BGBillingTokens WHERE customerId IN('131580191609')order by createdAt desc LIMIT 1;`;
    const result = await db.executeQuery(query);

    Allure.attachment('RESULTS', JSON.stringify(result));

    //validate query result
    expect(result).not.toBeNull();

    //db disconnect
    await db.disconnect();
  });
});
