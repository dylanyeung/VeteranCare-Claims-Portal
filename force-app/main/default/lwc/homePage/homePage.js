import { LightningElement } from 'lwc';
import bgImage from '@salesforce/resourceUrl/WelcomeBg';

export default class ESC_Homepage extends NavigationMixin(LightningElement) {
  backgroundStyle = `background-image: url(${CompanyBanner}); background-size: cover; background-position: center; width: 100%; padding: 100px 0;`;

  navigateToClaims() {
    console.log("Navigating to the page..");
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: '/claims'
        }
    });
  }
}