import { queryMDN } from '../../../resources/database/DatabaseQueries';
import MySQL from '../../../common/database/MySQL';
import PageActions from '../PageActions';
import Allure from '../../../resources/utils/Allure';
import {
  APACClient,
  CreditCardType,
  IncidentType,
  creditCards as cc
} from '../../../resources/data/Constants';
import { APACConnectionOptions } from '../../../resources/connections/DBConnections';
import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();
import * as Chance from 'chance';
const chance = Chance.default();

class ConsoleOne extends PageActions {
  get txtUsername() {
    return $('//input[@name="username"]');
  }

  get txtPassword() {
    return $('//input[@name="password"]');
  }

  get btnLogin() {
    return $('//button[@id="loginButton"]');
  }

  get btnStart() {
    return $('//a[text()="Start" and @class="nav-link"]');
  }

  get ddlClientName() {
    return $('//select[@name="selectedClient"]');
  }

  get ddlCulture() {
    return $('//select[@name="selectedCulture"]');
  }

  get optCultureEnglish() {
    return this.ddlCulture.$('//option[@value="en-US"]');
  }

  get ddlSearchBy() {
    return $('//select[@name="selectedSearchBy"]');
  }

  get optSearchByMDN() {
    return this.ddlSearchBy.$('//option[@value="mobilenumber"]');
  }

  get txtMobileNumber() {
    return $('//input[@name="cellNumber"]');
  }

  get btnSearch() {
    return $('//button[normalize-space()="Search"]');
  }

  get txtNationalIDNumber() {
    return $('//input[@placeholder="National Identification Number"]');
  }

  get btnContinue() {
    return $('//button[@type="button" and normalize-space()="Continue"]');
  }

  //-------Order Fullfillment
  get btnStartIncident() {
    return $('//button[normalize-space()="Start Incident"]');
  }

  get ddlIncidentType() {
    return $('//select[@name="incidentType"]');
  }

  get btnSelectAsset() {
    return $('//button[@name="selectAsset" and normalize-space()="SELECT"]');
  }

  get btnStartAdvanceExchange() {
    return $('//button[@name="repairmail"]');
  }

  get btnUseThisAddress() {
    return $('//button[normalize-space()="Use this Address"]');
  }

  get txtFirstName() {
    return $('//input[@name="firstName"]');
  }

  get txtLastName() {
    return $('//input[@name="lastName"]');
  }

  get ddlCardType() {
    return $('//select[@name="selectedCardType"]');
  }

  get txtCardNumber() {
    return $('//input[@name="cardNumber"]');
  }

  get txtExpMonth() {
    return $('//input[@name="expiryMonth"]');
  }

  get txtExpYear() {
    return $('//input[@name="expiryYear"]');
  }

  get txtCVVCode() {
    return $('//input[@name="cvvNumber"]');
  }

  get btnAgreeSubmitOrder() {
    return $('//button[normalize-space()="Agree Submit Order"]');
  }

  get ddlEndCallReason() {
    return $('//select[@name="endCallReason"]');
  }

  get ddlEndCallSubReason() {
    return $('//select[@name="endCallSubReason"]');
  }

  get btnEndCall() {
    return $('//button[normalize-space()="End Call"]');
  }

  //start web element for malfunction
  get rdoTriageRefused() {
    return $('//input[@value="Triage Refused"]');
  }

  get ddlRefusalReason() {
    return $('//select[@name="selectedRefusalReason"]');
  }

  get rdoTriageAccepted() {
    return $('//input[@value="Triage Accepted"]');
  }

  get rdoTriageSuccessful() {
    return $('//input[@value="Triage Successful"]');
  }

  get ddlResolutionType() {
    return $('//select[@name="selectedResolutionType"]');
  }

  get ddlTriageReason() {
    return $('//select[@name="selectedTriageReason"]');
  }
  //end web element for malfunction

  //start dashboard workqueue elements
  get btnDashboard() {
    return $('//a[@class="dashboardTab"]');
  }

  get btnWorkqueue() {
    return $('//a[normalize-space()="Workqueue"]');
  }

  get btnWorklist() {
    return $('//a[normalize-space()="Worklist"]');
  }

  get ddlViewQueueFor() {
    return $('//select[@name="selectedQueue"]');
  }

  get txtWorkqueueMDN() {
    return $('//input[@name="mdn"]');
  }

  get btnWorkqueueSearch() {
    return $('//button[normalize-space()="Search"]');
  }

  get chkWorkItem() {
    return $('//input[@name="selectWorkItem"]');
  }

  get txtAssignToUser() {
    return $('//input[@name="assignToUser"]');
  }

  get btnAssign() {
    return $('//button[normalize-space()="Assign"]');
  }

  get txtWorklistMDN() {
    return $('//input[@name="mdn"]');
  }

  get btnWorklistSearch() {
    return $('//button[normalize-space()="Search"]');
  }

  get lnkHoldRefNumber() {
    return $('//a[contains(text(),"HLD")]');
  }

  get ddlHoldAction() {
    return $('//select[@name="selectedHoldAction"]');
  }
  //end dashboard workqueue elements

  get prgLoader() {
    return $('//div[@class="loader"]');
  }

  login = async () => {
    Allure.logStep('Login to Console One Portal');
    await this.open();
    await this.enterText(this.txtUsername, env.CONSOLE_ONE_USERNAME as string);
    await this.enterText(this.txtPassword, env.CONSOLE_ONE_PASSWORD as string);
    await expect(this.txtUsername).toHaveValue(env.CONSOLE_ONE_USERNAME as string);
    await expect(this.txtPassword).toHaveValue(env.CONSOLE_ONE_PASSWORD as string);
    await this.click(this.btnLogin);
    await expect(this.btnStart).toBeClickable();
  };

  getExistingMDN = async (client: string): Promise<number> => {
    const db: MySQL = new MySQL(APACConnectionOptions);
    await db.connect();
    const aisMDN = await db.executeQuery(queryMDN(client));
    const randIndex = Math.floor(Math.random() * Math.min(aisMDN.rows.length, 100));
    const mdn = aisMDN.rows[randIndex].MOBILE_DEVICE_NBR;
    Allure.logStep(`MDN = ${aisMDN.rows[randIndex].MOBILE_DEVICE_NBR}`);
    await db.disconnect();
    return mdn;
  };

  getNationalIDNumber = async (client: string, mdn: number) => {
    let nationalIDNumber;
    switch (client) {
      case APACClient.AIS:
      case APACClient.M1:
      case APACClient.SINGTEL:
      case APACClient.STARHUB: {
        nationalIDNumber = mdn.toString().slice(-4);
        return nationalIDNumber;
      }
      case APACClient.CELCOM:
      case APACClient.TRUE: {
        nationalIDNumber = mdn;
        return nationalIDNumber;
      }
      default:
        throw new Error('Invalid client');
    }
  };

  agreementSearchByClientMDN = async (client: string, mdn: number) => {
    Allure.logStep('Agreement Search by Client MDN');
    const nationalIDNumber = await this.getNationalIDNumber(client, mdn);
    await this.click(this.btnStart);
    await this.selectDropdownByText(this.ddlClientName, client);
    await this.selectDropdownByText(this.ddlCulture, 'English');
    const cultureOption = await this.optCultureEnglish;
    expect(await cultureOption.getText()).toEqual('English');
    await this.selectDropdownByText(this.ddlSearchBy, 'Mobile Device Number');
    const searchByOption = await this.optSearchByMDN;
    expect(await searchByOption.getText()).toEqual('Mobile Device Number');
    await this.enterText(this.txtMobileNumber, mdn.toString());
    await this.click(this.btnSearch);
    await this.enterText(this.txtNationalIDNumber, nationalIDNumber);
    await this.click(this.btnContinue);

    return mdn;
  };

  incidentPathDetermination = async (incidentType: string, mdn: number) => {
    Allure.logStep(`Incident Type is ${incidentType}`);
    await this.click(this.btnStartIncident);
    await this.click(this.btnContinue);
    await this.selectDropdownByText(this.ddlIncidentType, incidentType);

    switch (incidentType) {
      case IncidentType.SWAP:
        await this.click(this.btnContinue);
        break;
      case IncidentType.REPLACEMENT:
        await this.click(this.btnContinue);
        await this.searchAndApproveHoldInDashboard(mdn);
        await this.click(this.btnContinue);
        break;
      case IncidentType.MALFUNCTION:
        await this.click(this.btnContinue);
        await this.click(this.rdoTriageRefused);
        await this.selectDropdownByIndex(this.ddlRefusalReason, 1);
        await this.click(this.btnContinue);
        break;
      default:
        throw new Error('Invalid card type');
    }
  };

  searchAndApproveHoldInDashboard = async (mdn: number) => {
    await this.click(this.btnDashboard);
    await this.click(this.btnWorkqueue);
    await this.selectDropdownByText(this.ddlViewQueueFor, 'Hold');
    await this.enterText(this.txtWorkqueueMDN, mdn);
    await this.click(this.btnWorkqueueSearch);
    await this.click(this.chkWorkItem);
    await this.enterText(this.txtAssignToUser, env.CONSOLE_ONE_USERNAME as string);
    await this.click(this.btnAssign);

    await this.click(this.btnWorklist);
    await this.enterText(this.txtWorklistMDN, mdn);
    await this.click(this.btnWorklistSearch);
    await this.click(this.lnkHoldRefNumber);

    await this.selectDropdownByText(this.ddlHoldAction, 'Approved');
    await this.click(this.btnContinue);
    await this.click(this.btnStart);
  };

  orderFulfillment = async () => {
    Allure.logStep('Order Fulfillment');
    await this.click(this.btnStartAdvanceExchange);
    Allure.logStep('Select Asset');
    await this.click(this.btnSelectAsset);
    await this.click(this.btnContinue);
  };

  shippingInformation = async () => {
    Allure.logStep('Shipping Information');
    await this.click(this.btnUseThisAddress);
    await this.click(this.btnContinue);
  };

  paymentDetails = async (creditCardType: string) => {
    Allure.logStep('Payment Details');
    await this.enterText(this.txtFirstName, chance.first({ nationality: 'en' }));
    await this.enterText(this.txtLastName, chance.last({ nationality: 'en' }));
    await this.selectDropdownByText(this.ddlCardType, creditCardType);
    await this.enterCreditCardInfo(creditCardType);
    await this.click(this.btnContinue);
  };

  enterCreditCardInfo = async (creditCardType: string) => {
    Allure.logStep('Enter Card Details');
    switch (creditCardType) {
      case CreditCardType.Visa:
        await this.enterText(this.txtCardNumber, cc.visa.cardNumber);
        await this.enterText(this.txtExpMonth, cc.visa.expMonth);
        await this.enterText(this.txtExpYear, cc.visa.expYear);
        await this.enterText(this.txtCVVCode, cc.visa.cvvCode);
        break;
      case CreditCardType.Master:
        await this.enterText(this.txtCardNumber, cc.master.cardNumber);
        await this.enterText(this.txtExpMonth, cc.master.expMonth);
        await this.enterText(this.txtExpYear, cc.master.expYear);
        await this.enterText(this.txtCVVCode, cc.master.cvvCode);
        break;
      case CreditCardType.Amex:
        await this.enterText(this.txtCardNumber, cc.amex.cardNumber);
        await this.enterText(this.txtExpMonth, cc.amex.expMonth);
        await this.enterText(this.txtExpYear, cc.amex.expYear);
        await this.enterText(this.txtCVVCode, cc.amex.cvvCode);
        break;
      default:
        throw new Error('Invalid credit card type');
    }
  };

  agreeAndSubmitOrder = async () => {
    Allure.logStep('Agree and Submit Order');
    await this.click(this.btnAgreeSubmitOrder);
    await this.prgLoader.waitForDisplayed({ reverse: true, timeout: 300000 });
  };

  open() {
    return super.openPage('https://ui-seahzn-ag-sqa.consoleone.apac.npr.aws.asurion.net/#/');
  }
}

export default new ConsoleOne();
