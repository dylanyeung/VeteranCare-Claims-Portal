import { LightningElement, wire } from 'lwc';
import { MessageContext, subscribe } from 'lightning/messageService'
import VETERAN_SEARCH_CHANNEL from '@salesforce/messageChannel/VeteranSearch__c';
import FLAG_IMAGE1 from '@salesforce/resourceUrl/AmericanFlag1';


export default class ProfileHeader extends LightningElement {

  userPhoto = FLAG_IMAGE1;
  name;
  branch;
  dischargeStatus;

  @wire(MessageContext)
  messageContext;  

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      VETERAN_SEARCH_CHANNEL,
      (message) => this.handleMessage(message)
    )
  }

  // handler for receiving messages from the message channel
  handleMessage(message) {
    this.name = message.name;
    this.branch = message.branch;
    this.dischargeStatus = message.dischargeStatus;
  }
}