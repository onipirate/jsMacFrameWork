import PageActions from '../PageActions';
import c1 from '../../../common/ui/pages/ConsoleOnePage';
import { IncidentType, creditCards } from '../../../resources/data/Constants';
import { getIMEIQuery } from '../../../resources/database/DatabaseQueries';
import MySQL from '../../../common/database/MySQL';
import { APACConnectionOptions } from '../../../resources/connections/DBConnections';
import Allure from '../../../resources/utils/Allure';

class AISWebChannel extends PageActions {
  get btnStartRequest() {
    return $('//span[normalize-space()="Start a request"]');
  }

  get btnCreateNewRequest() {
    return $('//label[normalize-space()="Create a new Request"]');
  }

  get btnResumeExistingRequest() {
    return $('//label[normalize-space()="Resume Existing Request"]');
  }

  get btnMyPhoneIsNoLongerInMyPosession() {
    return $('//label[normalize-space()="My phone is no longer in my possession"]');
  }

  get btnMyPhoneHasVisibleSignsOfDamage() {
    return $('//label[normalize-space()="My phone has visible signs of damage"]');
  }

  get btnLiquidExposure() {
    return $('//div[@name="Liquid Exposure"]');
  }

  get txtLast6DigitIMEI() {
    return $('//input[@placeholder="Enter last 6 digits of your IMEI"]');
  }

  get btnSubmitIMEI() {
    return $('//button[normalize-space()="Submit IMEI"]');
  }

  get btnMyPhoneIsNotWorkingOptimally() {
    return $('//label[normalize-space()="My phone is not working optimally"]');
  }

  get btnOtherIssue() {
    return $('//div[@name="Other issue"]');
  }

  get btnOnOffNo() {
    return $('//button[normalize-space()="No"]');
  }

  get btnUpdateOSNo() {
    return $('(//button[normalize-space()="No"])[2]');
  }

  get btnResetFactoryNo() {
    return $('(//button[normalize-space()="No"])[3]');
  }

  get txtRemarks() {
    return $('//textarea[@placeholder="Please state in brief what is wrong with your device"]');
  }

  get btnRemarksSubmit() {
    return $(
      '//button[@class="ais_device-select-button ais_survey-question ais_device-select-button-highlighted"]'
    );
  }

  get btnDisclaimerProceed() {
    return $(
      '//button[@class="ais_device-select-button disclaimerButtons"][normalize-space()="Proceed"]'
    );
  }

  get btnAcceptTerms() {
    return $('//button[normalize-space()="Accept"]');
  }

  get txtMobileNumber() {
    return $('//input[@placeholder="Enter your Mobile Number"]');
  }

  get btnSubmitMDN() {
    return $('//button[normalize-space()="Submit"]');
  }

  get txtLast4DigitID() {
    return $('//input[@placeholder="Enter the last 4 digits"]');
  }

  get btnSubmitIDNumber() {
    return $('//button[@class="ais_device-select-button ais_device-btn-width"]');
  }

  get btnProceedWithEnrolledDevice() {
    return $('//button[normalize-space()="Proceed"]');
  }

  get btnProceedServiceFee() {
    return $('//button[@class="ais_device-select-button ais_proceed "]');
  }

  get btnSMSYes() {
    return $('//button[normalize-space()="Yes"]');
  }

  get btnEmailYes() {
    return $('//button[@class="ais_align-popup-button"][normalize-space()="Yes"]');
  }

  get btnAddressYes() {
    return $('//button[@class="ais_align-popup-button"][normalize-space()="Yes"]');
  }

  get btnCreditCard() {
    return $('//button[@id="card-btn"]//img[@class="ais_image-icon-div"]');
  }

  get btnProceedCreditCard() {
    return $(
      '//button[@class="ais_device-select-button ais_proceed "][normalize-space()="Proceed"]'
    );
  }

  get txtCeditCardName() {
    return $('//input[@name="cc_name"]');
  }

  get txtCeditCardNumber() {
    return $('//input[@name="cc_number"]');
  }

  get txtCeditCardExpDate() {
    return $('//input[@name="cc_expDate"]');
  }

  get txtCeditCardCVC() {
    return $('//input[@name="cc_cvc"]');
  }

  get txtSubmitCardDetails() {
    return $('//button[@type="button"][normalize-space()="Submit"]');
  }

  get btnKeep() {
    return $('//button[normalize-space()="Keep"]');
  }

  get btnConfirm() {
    return $('//button[normalize-space()="Confirm"]');
  }

  createClaim = async (client: string, mdn: number, incidentType: string) => {
    Allure.logStep(`Create ${incidentType} claim for AIS with MDN = ${mdn}.`);
    await this.open();
    await this.click(this.btnStartRequest);
    await this.click(this.btnCreateNewRequest);
    await this.selectIncidentType(incidentType);
    await this.enterText(this.txtMobileNumber, mdn);
    await this.click(this.btnSubmitMDN);
    await this.enterText(this.txtLast4DigitID, await c1.getNationalIDNumber(client, mdn));
    await this.click(this.btnSubmitIDNumber);
    await this.click(this.btnProceedWithEnrolledDevice);

    if (incidentType !== IncidentType.REPLACEMENT) {
      if (incidentType === IncidentType.SWAP) {
        await this.click(this.btnLiquidExposure);
      } else {
        await this.click(this.btnOtherIssue);
      }
      await this.enterText(this.txtLast6DigitIMEI, await this.getLast6DigitIMEI(mdn));
      await this.click(this.btnSubmitIMEI);

      if (incidentType === IncidentType.MALFUNCTION) {
        await this.click(this.btnOtherIssue);
        await this.click(this.btnOnOffNo);
        await this.click(this.btnUpdateOSNo);
        await this.click(this.btnResetFactoryNo);
        await this.enterText(this.txtRemarks, 'Not Working');
        await this.click(this.btnRemarksSubmit);
      }
    }

    await this.clickWithTimeout(this.btnProceedServiceFee, 90000);
    await this.click(this.btnSMSYes);
    await this.click(this.btnEmailYes);
    await this.click(this.btnAddressYes);
    await this.click(this.btnCreditCard);

    Allure.logStep(`Enter Credit Card Details`);
    await this.click(this.btnProceedCreditCard);
    await this.enterTextWithTimeout(this.txtCeditCardName, 'Fname LastName', 60000);
    await this.enterText(this.txtCeditCardNumber, creditCards.master.cardNumber);
    await this.enterText(
      this.txtCeditCardExpDate,
      creditCards.master.expMonth + creditCards.master.expYear
    );
    await this.enterText(this.txtCeditCardCVC, creditCards.master.cvvCode);
    await this.click(this.txtSubmitCardDetails);
    await this.clickWithTimeout(this.btnKeep, 60000);

    Allure.logStep(`Comfirm Credit Card Details`);
    await this.clickWithTimeout(this.btnConfirm, 60000);
  };

  selectIncidentType = async (incidentType: string) => {
    switch (incidentType) {
      case IncidentType.SWAP:
        await this.click(this.btnMyPhoneHasVisibleSignsOfDamage);
        break;
      case IncidentType.REPLACEMENT:
        await this.click(this.btnMyPhoneIsNoLongerInMyPosession);
        break;
      case IncidentType.MALFUNCTION:
        await this.click(this.btnMyPhoneIsNotWorkingOptimally);
        break;
      default:
        throw new Error('Invalid card type');
    }
  };

  getLast6DigitIMEI = async (mdn: number): Promise<number> => {
    const db: MySQL = new MySQL(APACConnectionOptions);
    await db.connect();
    const imei = await db.executeQuery(getIMEIQuery(mdn));
    const imeiLast6Digit = imei.rows[0].SERIAL_NBR;
    Allure.logStep(`IMEI = ${imei.rows[0].SERIAL_NBR}`);
    await db.disconnect();
    return imeiLast6Digit.toString().slice(-6);
  };

  open() {
    return super.openPage(
      'https://mobilecare-ais-sqa.online.apac.nonprod-asurion53.com/?lang=en#/'
    );
  }
}

export default new AISWebChannel();
