import { APACClient, CreditCardType, IncidentType } from '../../../../resources/data/Constants';
import c1 from '../../../../common/ui/pages/ConsoleOnePage';
import aisWeb from '../../../../common/ui/pages/AISWebChannelPage';
import {
  verifyAndRetrieveAPACBGDBResponse,
  verifyBGDBTablesUsingBillingToken
} from '../../../../resources/database/DatabaseValidations';
import { getBillingTokenFromAPACDB } from '../../../../resources/database/DatabaseHelpers';
import { BGAPACConnectionOptions } from '../../../../resources/connections/DBConnections';

const scenarios = [
  {
    client: APACClient.AIS,
    incidentType: IncidentType.MALFUNCTION,
    creditCardType: CreditCardType.Visa
  },
  {
    client: APACClient.AIS,
    incidentType: IncidentType.MALFUNCTION,
    creditCardType: CreditCardType.Master
  }
];
let mdn: number;
for (const scenario of scenarios) {
  describe(`Verify APAC Web channel E2E test for - ${scenario.client} - ${scenario.incidentType} - ${scenario.creditCardType}`, () => {
    it('Web Channel Claim Filing', async () => {
      mdn = await c1.getExistingMDN(scenario.client);
      await aisWeb.createClaim(scenario.client, mdn, scenario.incidentType);
    });

    it('Database Validations', async () => {
      const apacResponse = await verifyAndRetrieveAPACBGDBResponse(BGAPACConnectionOptions, mdn);
      const billingToken = await getBillingTokenFromAPACDB(apacResponse);

      await verifyBGDBTablesUsingBillingToken(BGAPACConnectionOptions, billingToken);
    });
  });
}
