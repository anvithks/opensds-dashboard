import {browser, protractor, by, element, ElementArrayFinder} from 'protractor';
import { HomePage } from './home.po';

describe('Home page', () => {

    let page: HomePage;
    const EC = protractor.ExpectedConditions;

    beforeAll(() => {
        page = new HomePage();
        browser.get('/home');
      });

    it('should be in the home page', () => {
        //const homePage = new HomePage();
        browser.wait(EC.visibilityOf(page.cloudBackends), 10000);
        expect(page.cloudBackends.isDisplayed()).toBeTruthy();
    });

    it('should open Add Backend Dialog', () => {
        page.addBackendButton.click();
        expect(page.registerBackend.isDisplayed()).toBeTruthy();
    });

    it('should successfully Add a backend of type AWS', () => {
        
    });

    it('should successfully Add a backend of type Huawei OBS', () => {
    });

    it('should successfully Add a backend of type Azure', () => {
    });

    it('should successfully Add a backend of type YIG', () => {
        page.tryAddYIGBackend('test-yig-backend','YIG','testendpoint');
        browser.wait(EC.visibilityOf(page.title));
        expect(page.title.isPresent()).toBeTruthy();
    });
    
});