import {browser, element, ExpectedConditions, $} from 'protractor';
import {default as data} from '../data';
import {SettingsPage} from '../Page objects/SettingsPage';
import {LoginPage} from '../Page objects/LoginPage';
import {MainPage} from '../Page objects/MainPage';
import {DatabasePage} from '../Page objects/DatabasePage';

const path = require('path');

const loginPage: LoginPage = new LoginPage();
const mainPage: MainPage = new MainPage();
const settingsPage: SettingsPage = new SettingsPage();
const databasePage: DatabasePage = new DatabasePage();


describe('Reset button in Site header section of Settings', function () {
  // Navigate to login page, then save db and reset header settings to make them default
  beforeAll(function (done) {
    browser.get('/');
    browser.wait(ExpectedConditions.visibilityOf(settingsPage.saveButton));
    databasePage.saveDatabase(); // enter needed info in inputs and press save
    browser.wait(ExpectedConditions.visibilityOf(loginPage.loginButton));
    loginPage.login();
    browser.wait(ExpectedConditions.visibilityOf(mainPage.advancedButton));
    mainPage.advancedButton.click();
    browser.wait(ExpectedConditions.visibilityOf(mainPage.settingsButton));
    mainPage.settingsButton.click();
    settingsPage.SiteHeader.resetButton.click();
    browser.refresh();
    done();
  });

  // check that everything reset fine
  it('should reset image', function (done) {
    expect(browser.isElementPresent(settingsPage.headerImageMatcher))
      .toBeTruthy();
    done();
  });
  it('should reset header main text', function (done) {
    expect(browser.isElementPresent(settingsPage.mainTextHeaderMatcher)).toBeTruthy();
    expect(settingsPage.headerMainText.getText())
      .toEqual(data.SiteHeaderSettings.defaultSettings.headerMainText);
    done();
  });
  it('should reset header secondary text', function (done) {
    expect(browser.isElementPresent(settingsPage.secondaryTextHeaderMatcher)).toBeTruthy();
    expect(settingsPage.headerSecondaryText.getText())
      .toEqual(data.SiteHeaderSettings.defaultSettings.headerSecondaryText);
    done();
  });
});

// Check changing texts
describe('Settings in Site header section', () => {

  afterAll(function (done) {
    settingsPage.signOut();
    done();
  });

  afterEach((done) => {
    settingsPage.SiteHeader.resetAndRefresh();
    done();
  });

  it('should hide logo in header', (done) => {
    expect(element(settingsPage.headerImageMatcher).isDisplayed()).toBeTruthy();
    settingsPage.SiteHeader.headerImageHideButton.click();
    settingsPage.saveAndRefresh();
    expect(browser.isElementPresent(settingsPage.headerImageMatcher)).toBeFalsy();
    done();
  });

  it('should change Main text in header', function (done) {
    settingsPage.SiteHeader.mainTextInput.clear();
    settingsPage.SiteHeader.mainTextInput.sendKeys(data.SiteHeaderSettings.customSettings.mainTextSample);
    settingsPage.saveAndRefresh();
    expect(settingsPage.headerMainText.getText())
      .toEqual(data.SiteHeaderSettings.customSettings.mainTextSample);
    done();
  });

  it('should change secondary text in header', function (done) {
    settingsPage.SiteHeader.secondaryTextInput.clear();
    settingsPage.SiteHeader.secondaryTextInput.sendKeys(data.SiteHeaderSettings.customSettings.secondaryTextSample);
    settingsPage.saveAndRefresh();
    expect(settingsPage.headerSecondaryText.getText()).toEqual(data.SiteHeaderSettings.customSettings.secondaryTextSample);
    done();
  });

  it('should hide main text in header', function (done) {
    settingsPage.SiteHeader.hideMainTextButton.click();
    settingsPage.saveAndRefresh();
    expect(browser.isElementPresent(settingsPage.mainTextHeaderMatcher)).toBeFalsy();
    done();
  });

  it('should hide secodary text in header', function (done) {
    settingsPage.SiteHeader.hideSecondaryTextButton.click();
    settingsPage.saveAndRefresh();
    expect(browser.isElementPresent(settingsPage.secondaryTextHeaderMatcher)).toBeFalsy();
    done();
  });

  // This test will be completed as soon as tool for image comparison is found
  xit('should be able to change logo file', function (done) {
    const fileToUpload = data.SiteHeaderSettings.customSettings.logoFilePath;
    const absolutePath = path.resolve(__dirname, fileToUpload);
    settingsPage.SiteHeader.fileInput.sendKeys(absolutePath);
    settingsPage.saveAndRefresh();
    expect((element(settingsPage.headerImageMatcher)).getAttribute('src'))
      .toEqual(absolutePath);
    done();
  });

});
