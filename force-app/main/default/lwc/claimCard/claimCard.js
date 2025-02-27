import getClaimDocumentId from '@salesforce/apex/ClaimDocumentController.getClaimDocumentId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { LightningElement, api, track } from 'lwc';

export default class ClaimCard extends LightningElement {
    @api recordType;  // Expected object: { label, apiName, icon }
    @api claim;       // May be null if no claim exists
    
    @track isUploadModalOpen = false;
    claimDocumentId;

    // Fetch claim document when component loads
    connectedCallback() {
        this.fetchClaimDocument();
    }

    // Convert claim type from "Disability_Compensation" to "Disability Compensation"
    get formattedClaimType() {
        return this.recordType?.apiName.replace(/_/g, ' ') || '';
    }

    // Fetch the correct Claim Document ID for the user's active claim
    fetchClaimDocument() {
        if (this.formattedClaimType) {
            getClaimDocumentId({ claimType: this.formattedClaimType })
                .then(result => {
                    this.claimDocumentId = result;
                    console.log('Claim Document ID:', this.claimDocumentId);
                })
                .catch(error => {
                    console.error('Error fetching Claim Document:', error);
                });
        }
    }
    

    // Get the correct icon based on claim type
    get claimIcon() {
        const iconMap = {
            "Disability Compensation": "utility:heart",
            "Pension": "utility:moneybag",
            "Healthcare Benefits": "utility:co_ins_infusion",
            "Education and Training": "utility:education",
            "Housing Assistance": "utility:home"
        };
        return iconMap[this.recordType?.label] || "utility:custom_apps";
    }

    get recordTypeName() {
        return this.recordType?.label || '';
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

    // Open the upload modal
    handleOpenUploadModal() {
        if (!this.claimDocumentId) {
            this.showToast('Error', 'No open claim document found for this claim type.', 'error');
            return;
        }
        this.isUploadModalOpen = true;
    }

    // Close the upload modal
    handleCloseUploadModal() {
        this.isUploadModalOpen = false;
    }

    // Handle successful file upload
    handleUploadFinished(event) {
        console.log('Files uploaded successfully:', event.detail.files);
        this.showToast('Success', 'Files uploaded successfully!', 'success');
        this.isUploadModalOpen = false;
    }

    // Show toast notifications
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
