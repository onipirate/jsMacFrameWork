import {
  verifyBGDBTablesUsingBillingToken,
  verifyBGDBTablesUsingCaseNumber
} from '../../resources/database/DatabaseValidations';
import { BGUSConnectionOptions } from '../../resources/connections/DBConnections';
import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

const caseNumbers = env.CASE_NUMBERS || undefined;
const arrCaseNumbers = caseNumbers?.split(',').map(Number);
const billingTokens = env.BILLING_TOKENS || undefined;
const arrBillingTokens = billingTokens?.split(',');
describe('BG DB Validations', () => {
  if (arrCaseNumbers) {
    for (const caseNumber of arrCaseNumbers) {
      it(`BG DB Validations using case number = ${caseNumber}`, async () => {
        await verifyBGDBTablesUsingCaseNumber(BGUSConnectionOptions, caseNumber);
      });
    }
  }
  if (arrBillingTokens) {
    for (const billingToken of arrBillingTokens) {
      it(`BG DB Validations using billing token = ${billingToken}`, async () => {
        await verifyBGDBTablesUsingBillingToken(BGUSConnectionOptions, billingToken);
      });
    }
  }
});
