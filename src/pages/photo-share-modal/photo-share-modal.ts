import {Component} from '@angular/core';
import {NavParams, ViewController, Events, IonicPage} from 'ionic-angular';
import {AnalyticsProvider} from '../../providers/analytics/analytics';
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
//import Parse from "parse";
//declare var Parse: any;
@IonicPage()
@Component({
    selector:    'photo-share-modal',
    templateUrl: 'photo-share-modal.html'
})
export class PhotoShareModalPage {
    form         = {
        title:     '',
        privacity: 'public',
        image:     null,
        address:   {},
        albumId:   null,
        location:  null,
    };
    location: any;
    address: any = {};

    album: any;
    eventName: string;

    _eventName: string = 'photoshare:crop';

    constructor(private navparams: NavParams,
                private viewCtrl: ViewController,
                private events: Events,
                private analytics: AnalyticsProvider,
                private util: IonicUtilProvider,
               
    ) {
        // Google Analytics
        this.analytics.view('PhotoShareModalPage');

        this.form.image = this.navparams.get('base64');
        this.eventName  = this.navparams.get('eventName');
        this.album      = this.navparams.get('album');

        if (this.album) {
            this.form.albumId = this.album.id;
            console.log(this.album.imageThumb)
        }

        this.events.subscribe('album:selected', album => this.form.albumId = album['id']);
        this.events.subscribe('address:selected', address => this.form.address  = address);
    }

    ionViewWillEnter() {
    }

    ngOnDestroy() {
        this.events.unsubscribe(this._eventName);
        this.events.unsubscribe('album:selected');
        this.events.unsubscribe('address:selected');
    }

    submit(form) {
        if (form.valid && this.form.image) {
            //this.gallery.createGallery(form).then(() => {
            this.events.unsubscribe(this.eventName);
            this.viewCtrl.dismiss({ form: this.form });
            // });
        }
        else if (form.valid && this.form.title) {
            this.events.unsubscribe(this.eventName);
            this.viewCtrl.dismiss({ form: this.form });
        }
        else {
            this.util.toast("Message cannot be empty")
        }
        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
