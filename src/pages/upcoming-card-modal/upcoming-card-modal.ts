import {Component} from '@angular/core';
import {ViewController, NavParams, IonicPage, Events} from 'ionic-angular';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import { Http, Headers } from '@angular/http';
import { Stripe } from '@ionic-native/stripe';
import { SERVER_URL, SERVER_URL_Pay} from '../../config'
import Parse from "parse";

import * as moment from 'moment'

import * as _ from 'underscore';
import {AnalyticsProvider} from "../../providers/analytics/analytics";

@IonicPage()
@Component({
        selector: 'upcoming-card-modal',
        templateUrl: 'upcoming-card-modal.html'
})
export class UpcomingCardModalPage {
    user?: any;
    year: any = moment().add('years', 5).format('YYYY')
    cardinfo: any = {
        number: '',
        expMonth: '',
        expYear: '',
        cvc: ''
    };
    form: any;
    constructor(private viewCtrl: ViewController,
                private ionicUtil: IonicUtilProvider,
                private navParams: NavParams,
                private analytics: AnalyticsProvider,
                private events: Events,
                public stripe: Stripe,
                public http: Http
    ) {
        // Google Analytics
        this.analytics.view('UpcomingCardModalPage');

        this.form = this.navParams.get('form');
        if (this.form) {
            ionicUtil.cordova
            this.user = Parse.User.current();
            console.log(this.user)
        }

    }

    ionViewWillLoad() {

    }

   


    pay(form) {
        //if (form.valid) {
        //    console.log(form)
        //    console.log(this.cardinfo)
        //}
        //if (this.ionicUtil.cordova) {
        //    this.stripe.setPublishableKey('pk_test');
        //    this.stripe.createCardToken(this.cardinfo).then((token) => {
        //        var data = 'stripetoken=' + token + '&amount=' + this.form.publicfee;
        //        var headers = new Headers();
        //        headers.append('Conent-Type', 'application/x-www-form-urlencoded');
        //        this.http.post(SERVER_URL, data, { headers: headers }).subscribe((res) => {
        //            if (res.json().success) {
        //                this.viewCtrl.dismiss({ isSuccess: true });
        //                // alert('transaction Successfull!!')
        //            }
        //            if (res.json().error) {
        //                this.viewCtrl.dismiss({ isSuccess: false });
        //                //alert('transaction Successfull!!')
        //            }
        //        })
        //    })
        //} else {
        //    this.viewCtrl.dismiss({ isSuccess: true });
        //}
    }


    dismiss(): void {
        this.viewCtrl.dismiss({ isSuccess: false });
    }

}
