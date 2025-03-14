import { LightningElement, wire, track } from 'lwc';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
import getVeteranInfo from '@salesforce/apex/getVeteranRecord.getVeteranInfo';
import { MessageContext, publish } from 'lightning/messageService';
import VETERAN_SEARCH_CHANNEL from '@salesforce/messageChannel/VeteranSearch__c';

export default class ProfilePage extends LightningElement {

  userName;
  email;
  phone;
  dob;
  militaryBranch;
  dischargeStatus;
  militaryStartDate;
  militaryEndDate;
  disabilityPercentage;
  creditScore;
  ssn;

  @track formattedPhoneNumber = '';
  @track maskedSSN = '';


  editInfo = false;
  wiredResult;

  @wire(MessageContext)
    messageContext;


  @wire(getVeteranInfo, {userId: Id})
  veteranDetails(results) {
    this.wiredResult = results;
    if(results.data) {
      this.userName = results.data.	First_Name__c + " " + results.data.	Last_Name__c;
      this.creditScore = results.data.Credit_Score__c;

      this.email = results.data.Email__c;
      this.phone = results.data.Primary_Phone_Number__c;
      this.dob = results.data.Date_of_Birth__c;

      this.militaryBranch = results.data.Military_Branch__c;
      this.militaryStartDate = results.data.Military_Service_Start_Date__c;
      this.militaryEndDate = results.data.Military_Service_End_Date__c;
      this.dischargeStatus = results.data.Discharge_Status__c;

      this.disabilityPercentage = results.data.Disability_Percentage__c;
      this.ssn = results.data.Social_Security_Number__c;

      this.formattedPhoneNumber = this.formatPhoneNumber(this.phone);
      this.maskedSSN = this.maskSSN(this.ssn);

      const payload = {
        name: this.userName,
        branch: this.militaryBranch,
        dischargeStatus: this.dischargeStatus,
      }

      // publishing the message
      publish(this.messageContext, VETERAN_SEARCH_CHANNEL, payload);

    } else if (results.error) {
      this.errorMessage = results.error.body.message;
    }  
  }

  handleInfoUpdate() {
    if(this.editInfo == true) {
      this.editInfo = false;
    } else {
      this.editInfo = true;
    }
  }

  handleFlowStatusChange(event) {
    if (event.detail.status === "FINISHED") {
      console.log("Flow has completed!");
      this.editInfo = false;
      refreshApex(this.wiredResult);
      window.location.reload();
    }
  }

  // Formatting field functions to display
  formatPhoneNumber(number) {
    if (!number) return '';
    const cleaned = number.toString().replace(/\D/g, ''); // convert to string, remove non-numeric characters
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : number;
  }

  maskSSN(ssn) {
    if (!ssn) return '';
    const cleaned = ssn.toString().replace(/\D/g, '');
    if (cleaned.length === 9) {
        return `XXX-XX-${cleaned.slice(-4)}`;
    }
    return ssn;
  }
}