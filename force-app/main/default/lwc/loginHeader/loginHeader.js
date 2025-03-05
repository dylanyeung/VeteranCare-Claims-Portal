import { LightningElement } from 'lwc';

export default class LoginHeader extends LightningElement {
  pledge = [
    "I pledge allegiance to the flag of the United States of America,",
    "and to the republic for which it stands,",
    "one nation under God, indivisible, with liberty and justice for all."
  ];

  currentPledge = this.pledge.join(' ');
}