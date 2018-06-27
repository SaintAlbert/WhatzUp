import {Component} from '@angular/core';
import {ViewController, NavParams, IonicPage, Events} from 'ionic-angular';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import {FormBuilder, Validators} from "@angular/forms";

import * as _ from 'underscore';
import {AnalyticsProvider} from "../../providers/analytics/analytics";

@IonicPage()
@Component({
        selector: 'share-event-form-modal',
        templateUrl: 'share-event-form-modal.html'
})
export class ShareEventFormModal {
    form: any = {};

    constructor(private viewCtrl: ViewController,
                private ionicUtil: IonicUtilProvider,
                private navParams: NavParams,
                private formBuilder: FormBuilder,
                private analytics: AnalyticsProvider,
                private events: Events
    ) {
        // Google Analytics
        this.analytics.view('ShareEventFormModal');

        var form = this.navParams.get('form');
        this.form = form.form
        //if (this.form) {
        
        //}
    }

    ionViewWillLoad() {
        var form = this.navParams.get('form');
        this.form = form.form
    }

    submit(): void {
            console.log(this.form);
            this.ionicUtil.onLoading();
            this.events.unsubscribe('upload:gallery');
            this.viewCtrl.dismiss({ form: this.form });
    }

    shareSet(share) {
        if (share == 'public') {
            this.form.privacity = 'public';
            this.form.payment = this.form.symbol + this.form.publicfee;
        }
        if (share == 'followers') {
            this.form.privacity = 'followers';
            this.form.payment = this.form.symbol + this.form.frendshipfee;
        }
        if (share == 'me') {
            this.form.privacity = 'me';
            this.form.payment = this.form.symbol+0.00;
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
