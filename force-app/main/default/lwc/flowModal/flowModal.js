import { LightningElement, api } from 'lwc';

export default class FlowModal extends LightningElement {
    @api flowApiName;       // e.g. "ExperienceSiteCreateClaim"
    @api flowClaimType;     // Value passed from the parent

    flowStarted = false;

    renderedCallback() {
        const flow = this.template.querySelector('lightning-flow');
        if (flow && !this.flowStarted) {
            this.flowStarted = true;
            const inputVariables = [{
                name: 'claimType',
                type: 'String',
                value: this.flowClaimType
            }];
            console.log('FlowModal: Starting flow with', this.flowApiName, 'and input:', inputVariables);
            flow.startFlow(this.flowApiName, inputVariables);
        }
    }

    handleClose() {
        // Reset the flag so that a new flow instance can start next time.
        this.flowStarted = false;
        this.dispatchEvent(new CustomEvent('close'));
    }
}