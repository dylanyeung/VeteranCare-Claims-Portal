import { LightningElement } from 'lwc';
import bgImage from '@salesforce/resourceUrl/WelcomeBg';
import CompanyBanner from '@salesforce/resourceUrl/CompanyBanner';

export default class ESC_Homepage extends LightningElement {
  backgroundStyle = `background-image: url(${CompanyBanner}); background-size: cover; background-position: center; width: 100%; padding: 100px 0;`;
}