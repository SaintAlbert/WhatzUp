import {Component, OnInit, Input} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Events, NavController} from "ionic-angular";
import { CreditCardValidator } from 'ng2-cc-library';
import { Stripe } from '@ionic-native/stripe';
import _ from "underscore";

import Parse from "parse";

@Component({
    selector: 'credit-card',
    templateUrl:'credit-card.html'
  //  templateUrl: `
  //  <form #demoForm="ngForm" (ngSubmit)="onSubmit(demoForm)" novalidate>
  //      <input id="cc-number" formControlName="creditCard" type="tel" autocomplete="cc-number" ccNumber>
  //      <input id="cc-exp-date" formControlName="expirationDate" type="tel" autocomplete="cc-exp" ccExp>
  //      <input id="cc-cvc" formControlName="cvc" type="tel" autocomplete="off" ccCvc>
  //  </form>
  //`
})

export class CreditCardComponent implements OnInit {

    @Input() price?: any;
    form: FormGroup;
    submitted: boolean = false;

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    data = [];


    constructor(
        private events: Events,
        private navCtrl: NavController,
        private _fb: FormBuilder,
        public stripe: Stripe,
    ) {
        this.events.unsubscribe("creditcard");

    }

    ngOnInit() {
        this.form = this._fb.group({
            creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
            expirationDate: ['', [<any>CreditCardValidator.validateExpDate]],
            cvc: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]]
        });
    }

    onSubmit(form) {
        if (form.valid) {
            this.submitted = true;
            this.stripe.setPublishableKey('pk_test');
            this.stripe.createCardToken(form).then((token) => {
                console.log(form);
                this.events.publish("creditcard", { token: form});
            });
        }
    }


}
