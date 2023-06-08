import { APACClient, CreditCardType, IncidentType } from '../../../../resources/data/Constants';
import c1 from '../../../../common/ui/pages/ConsoleOnePage';
import {
  verifyAndRetrieveAPACBGDBResponse,
  verifyBGDBTablesUsingBillingToken
} from '../../../../resources/database/DatabaseValidations';
import { getBillingTokenFromAPACDB } from '../../../../resources/database/DatabaseHelpers';
import { BGAPACConnectionOptions } from '../../../../resources/connections/DBConnections';

const scenarios = [
  {
    client: APACClient.TRUE,
    incidentType: IncidentType.MALFUNCTION,
    creditCardType: CreditCardType.Visa
  },
  {
    client: APACClient.TRUE,
    incidentType: IncidentType.MALFUNCTION,
    creditCardType: CreditCardType.Master
  }
];
let mdn: number;
for (const scenario of scenarios) {
  describe(`Verify APAC agent channel E2E test for - ${scenario.client} - ${scenario.incidentType} - ${scenario.creditCardType}`, () => {
    it('Agent Channel Claim Filing', async () => {
      await c1.login();
      mdn = await c1.getExistingMDN(scenario.client);
      await c1.agreementSearchByClientMDN(scenario.client, mdn);
      await c1.incidentPathDetermination(scenario.incidentType, mdn);
      await c1.orderFulfillment();
      await c1.shippingInformation();
      await c1.paymentDetails(scenario.creditCardType);
      await c1.agreeAndSubmitOrder();
    });

    it('Database Validations', async () => {
      const apacResponse = await verifyAndRetrieveAPACBGDBResponse(BGAPACConnectionOptions, mdn);
      const billingToken = await getBillingTokenFromAPACDB(apacResponse);

      await verifyBGDBTablesUsingBillingToken(BGAPACConnectionOptions, billingToken);
    });
  });
}
