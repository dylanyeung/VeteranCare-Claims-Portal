import { LightningElement, wire } from 'lwc';
import getExpirationDaysLeft from '@salesforce/apex/TrialExpirationController.getExpirationDaysLeft';

export default class TrialExpirationLWC extends LightningElement {
     daysLeftString;
	 errors;

    // Bind method to a function (used as we want to concatenate with a string)
    @wire(getExpirationDaysLeft) wiredDaysLeft({error, data}) {
        if (data) {
            this.daysLeftString = 'This org will expire in ' + data + ' days';
			this.errors = undefined;
        } else if (error) {
            this.errors = error;
			this.daysLeftString = undefined;
        }
    }
}