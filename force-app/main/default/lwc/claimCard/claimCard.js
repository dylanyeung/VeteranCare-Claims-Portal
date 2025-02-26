import { LightningElement, api } from 'lwc';

export default class ClaimCard extends LightningElement {
    @api recordType;  // Expected object: { label, apiName, icon }
    @api claim;       // May be null if no claim exists

    get claimIcon() {
        const iconMap = {
            "Disability Compensation": "utility:heart",
            "Pension": "utility:moneybag",
            "Healthcare Benefits": "utility:co_ins_infusion",
            "Education and Training": "utility:education",
            "Housing Assistance": "utility:home"
        };
        return iconMap[this.recordType.label] || "utility:custom_apps";
    }

    get recordTypeName() {
        return this.recordType && this.recordType.label ? this.recordType.label : '';
    }

    get hasClaim() {
        return Boolean(this.claim);
    }

    get isDenied() {
        return this.hasClaim && this.claim.Current_Status__c === 'Denied';
    }

    get isApproved() {
        return this.hasClaim && this.claim.Current_Status__c === 'Approved';
    }
    
    get isOpen() {
        return this.hasClaim && (this.claim.Current_Status__c !== 'Approved' && this.claim.Current_Status__c !== 'Denied');
    }

    // Launches the flow for a new claim using direct navigation.
    handleStartNewClaim() {
        const claimType = this.recordType.apiName;
        console.log('ClaimCard: Launching flow with claimType:', claimType);
        // Construct the flow URL with the claimType parameter
        const flowUrl = `/flow/ExperienceSiteCreateClaim?claimType=${claimType}&retURL=veteran/s/claims`;
        window.location.href = flowUrl;
    }

    // Launches the flow for an appeal using direct navigation.
    handleStartAppeal() {
        const claimType = this.recordType.apiName;
        console.log('ClaimCard: Launching appeal flow with claimType:', claimType);
        const flowUrl = `/flow/ExperienceSiteCreateClaim?claimType=${claimType}`;
        window.location.href = flowUrl;
    }
}