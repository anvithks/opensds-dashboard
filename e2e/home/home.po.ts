import {by, element} from 'protractor';

export class HomePage {
  get title() {
    return element(by.css('.topbar-menu > li > a > h1'));
  }

  get cloudBackends() {
      return element(by.css('.ui-home-backend-container'));
  }

  get addBackendButton(){
    return element(by.className('ui-home-backend-add'));
  }
  get registerBackend(){
    return element(by.css('.register-storage-backend'));
  }
  get backendName(){
    return element(by.id('name'));
  }
  get backendType(){
    return element(by.name("type-select"));
  }

  get backendRegion(){
    return element(by.id('region'));
  }
  /* get backendEndpoint(){
    return element(by.id('endpoint'));
  } */
  get backendBucket(){
    return element(by.id('bucket'));
  }
  get backendAccessKey(){
    return element(by.id('accessKey'));
  }
  get backendSecretKey(){
    return element(by.id('secretKey'));
  }
  get submitAddBucket(){
    return element(by.className('add-backend-submit-btn'));
  }
  /*  get logoutLink() {
    return element(by.css('.header__logout'));
  } */

  //Add all other backends except YIG
  tryAddBackend(name: string, type: string, region: string, endpoint: string, bucket: string, accessKey: string, secretKey: string) {
    this.backendName.sendKeys(name);
    //this.backendType.sendKeys(type);
    this.backendRegion.sendKeys(region);
    //this.backendEndpoint.sendKeys(endpoint);
    this.backendBucket.sendKeys(bucket);
    this.backendAccessKey.sendKeys(accessKey);
    this.backendSecretKey.sendKeys(secretKey);
    
    this.submitAddBucket.click();
  }
  //Add YIG Backend
  tryAddYIGBackend(name: string, type: string, endpoint: string,){
    this.backendName.sendKeys(name);
    // console.log("Select Type", element(by.name('type-select')));
    element(by.css('.ui-dropdown-trigger')).click();
    element(by.cssContainingText('.ui-dropdown-list > li.ui-dropdown-item > span', type)).click();
    element(by.id('endpoint')).sendKeys(endpoint);
    this.submitAddBucket.click();
  }
}