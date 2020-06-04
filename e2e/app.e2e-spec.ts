import {browser, protractor, by, element, ElementArrayFinder} from 'protractor';
import { AppPage } from './app.po';
import { HomePage } from './home/home.po';

describe('Login page', () => {

  let page: AppPage;
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AppPage();
    browser.get('/');
  });

 /*  it('should have correct titles and button text', () => {
 
  }); */
  it ('should display an error message to the user if the backend is not ready or down', () => {
    page.trySignIn('admin', 'opensds123');
    browser.wait(EC.visibilityOf(page.errorMessage));
    expect(page.errorMessage.getText()).toEqual('Internal Server Error!');
  });
 
  it ('should display an error message to the user if they provided incorrect credentials', () => {
    page.trySignIn('wrongUserName', '123456');
    browser.wait(EC.visibilityOf(page.errorMessage));
    expect(page.errorMessage.getText()).toEqual('Incorrect username or password!');
  });
 
  it ('should redirect the user to the dashboard page if they provided correct credentials', () => {
    const homePage = new HomePage();
    page.trySignIn('admin', 'opensds@123');
    browser.wait(EC.visibilityOf(homePage.title));
    expect(homePage.title.isPresent()).toBeTruthy();
  });
 });