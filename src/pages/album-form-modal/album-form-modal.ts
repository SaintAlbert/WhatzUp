import {Component} from '@angular/core';
import {ViewController, NavParams, IonicPage, Events} from 'ionic-angular';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import {FormBuilder, Validators} from "@angular/forms";

import * as _ from 'underscore';
import {GalleryAlbumProvider} from "../../providers/gallery-album/gallery-album";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

@IonicPage()
@Component({
    selector   : 'album-form-modal',
    templateUrl: 'album-form-modal.html'
})
export class AlbumFormModalPage {
    id: string;
    form: any;

    constructor(private viewCtrl: ViewController,
                private provider: GalleryAlbumProvider,
                private ionicUtil: IonicUtilProvider,
                private navParams: NavParams,
                private formBuilder: FormBuilder,
                private analytics: AnalyticsProvider,
                private events: Events
    ) {
        // Google Analytics
        this.analytics.view('AlbumFormModalPage');

        this.id = this.navParams.get('id');
        if (this.id) {
            this.get();
        }

    }

    ionViewWillLoad() {
        this.form = this.formBuilder.group({
            id         : [''],
            title      : ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            description: [''],
        });

    }

    get() {
        this.ionicUtil.onLoading();
        this.provider.get(this.id).then(album => {
            _.each(album['attributes'], (value, key) => {
                if (this.form.controls[key]) {
                    this.form.controls[key].setValue(value);
                }
            });
            this.ionicUtil.endLoading();
        })
    }

    submit(form: any): void {

        if (form.valid) {
            console.log(this.form);
            this.ionicUtil.onLoading();
            this.provider.put(this.form.value).then(parseItem => {
                this.ionicUtil.endLoading();
                //this.events.publish('newalbum:created', form);
                //this.viewCtrl.dismiss();
                this.dismiss();
            });
            setTimeout(() => { this.dismiss() },200)
           // this.dismiss();
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
