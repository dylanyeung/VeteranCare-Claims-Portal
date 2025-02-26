import { LightningElement, api } from 'lwc';

export default class VeteranRedirect extends LightningElement {
    @api redirectUrl;

    connectedCallback() {
        // Redirect the user as soon as the component loads
        window.location.href = this.redirectUrl;
    }
}