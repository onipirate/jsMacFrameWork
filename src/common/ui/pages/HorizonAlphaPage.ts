import PageActions from '../PageActions';

class HorizonAlpha extends PageActions {
  get txtUsername() {
    return $('//input[@id="accountName"]');
  }

  get txtPassword() {
    return $('//input[@id="password"]');
  }

  get btnSignOn() {
    return $('//a[@title="Sign On"]');
  }

  get btnSignInSSO() {
    return $('//input[@type="button"]');
  }

  get btnStart() {
    return $('//button[@id="start-interaction-button"]');
  }

  open() {
    return super.openPage('https://sqa.alpha.mobilityac.npr.aws.asurion.net/signIn');
  }
}

export default new HorizonAlpha();
