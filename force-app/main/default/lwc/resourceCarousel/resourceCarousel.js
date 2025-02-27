import { LightningElement } from 'lwc';
import FLAG_IMAGE1 from '@salesforce/resourceUrl/AmericanFlag1';
import FLAG_IMAGE2 from '@salesforce/resourceUrl/AmericanFlag2';
import FLAG_IMAGE3 from '@salesforce/resourceUrl/AmericanFlag3';
import FLAG_IMAGE4 from '@salesforce/resourceUrl/AmericanFlag4';
import FLAG_IMAGE5 from '@salesforce/resourceUrl/AmericanFlag5';

export default class ResourceCarousel extends LightningElement {

  flag1 = FLAG_IMAGE1;
  flag2 = FLAG_IMAGE2;
  flag3 = FLAG_IMAGE3;
  flag4 = FLAG_IMAGE4;
  flag5 = FLAG_IMAGE5;

  openNewTab(event) {
    const url = event.target.dataset.url;
    if (url) {
      window.open(url, '_blank');
    }
  }
    
}