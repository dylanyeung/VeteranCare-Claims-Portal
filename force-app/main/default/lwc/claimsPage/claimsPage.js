import { LightningElement, wire, track } from 'lwc';
import getVeteranClaims from '@salesforce/apex/ClaimsController.getVeteranClaims';

export default class ClaimsPage extends LightningElement {
    @track claimsByRecordType = {};
    @track showFlowModal = false;
    @track flowApiName = '';
    // Optionally, capture the claim type if needed:
    @track flowClaimType = '';

    // Define the five record types using their DeveloperName values
    claimRecordTypes = [
        { label: 'Disability Compensation', apiName: 'Disability_Compensation', icon: 'utility:medication_reminder' },
        { label: 'Pension', apiName: 'Pension', icon: 'utility:moneybag' },
        { label: 'Healthcare Benefits', apiName: 'Healthcare_Benefits', icon: 'utility:co_ins_infusion' },
        { label: 'Education and Training', apiName: 'Education_and_Training', icon: 'utility:education' },
        { label: 'Housing Assistance', apiName: 'Housing_Assistance', icon: 'utility:home' }
    ];

    @wire(getVeteranClaims)
    wiredClaims({ error, data }) {
        if (data) {
            console.log('✅ Retrieved Claims:', JSON.stringify(data));
            // Initialize claimsByRecordType with null for each record type
            let claimMap = {};
            this.claimRecordTypes.forEach(type => {
                claimMap[type.apiName] = null;
            });
            // For each retrieved claim, map it based on its RecordType.DeveloperName.
            // If multiple claims exist for a type, choose the most recent based on CreatedDate.
            data.forEach(claim => {
                if (claim.RecordType && claim.RecordType.DeveloperName) {
                    const type = claim.RecordType.DeveloperName;
                    if (this.claimRecordTypes.some(rec => rec.apiName === type)) {
                        if (!claimMap[type] || new Date(claim.CreatedDate) > new Date(claimMap[type].CreatedDate)) {
                            claimMap[type] = claim;
                        }
                    } else {
                        console.warn(`⚠️ Unexpected record type: ${type}`, claim);
                    }
                }
            });
            this.claimsByRecordType = { ...claimMap };
            console.log('🔄 Updated claimsByRecordType:', JSON.stringify(this.claimsByRecordType));
        } else if (error) {
            console.error('🚨 Error retrieving claims:', error);
        }
    }

    // Precompute an array for the template
    get processedClaims() {
        return this.claimRecordTypes.map(recordType => ({
            recordType: recordType,
            claim: this.claimsByRecordType[recordType.apiName] || null
        }));
    }

    connectedCallback() {
        console.log('FlowModal: Component rendered with flowApiName:', this.flowApiName);
    }
    

    handleLaunchFlow(event) {
        console.log('ClaimsPage: Received launchflow event with detail:', event.detail);
        const { flowApiName, claimType } = event.detail;
        this.flowApiName = flowApiName;
        this.flowClaimType = claimType; // capture the claim type
        this.showFlowModal = true;
    }
    

    handleFlowModalClose() {
        this.showFlowModal = false;
    }
}