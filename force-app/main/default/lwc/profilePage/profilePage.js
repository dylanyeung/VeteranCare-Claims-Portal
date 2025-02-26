import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';

import getVeteranInfo from '@salesforce/apex/getVeteranRecord.getVeteranInfo';
import { MessageContext, publish } from 'lightning/messageService';
import VETERAN_SEARCH_CHANNEL from '@salesforce/messageChannel/VeteranSearch__c';

export default class ProfilePage extends LightningElement {

  userId = Id;
  // userId = '0054U00000IEvZiQAL'; // Aaron
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

  editInfo = false;
  wiredResult;

  @wire(MessageContext)
    messageContext;                                     // wiring in Lightning Message Service


  // @wire(getRecord, { recordId: Id, fields: [Name, RoleName, ProfileName] })
  // userDetails({ error, data }) {
  //   if (error) {
  //     this.error = error;
  //   } else if (data) {
  //     // if (data.fields.Name.value != null) {
  //     //   this.userName = data.fields.Name.value;
  //     // }
  //   }
  // }

  @wire(getVeteranInfo, {userId: '$userId'})
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
      this.count = this.count + 1;

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
        // Perform any post-flow actions here
        // this.dispatchEvent(new CustomEvent('flowfinished'));
    }
}
}