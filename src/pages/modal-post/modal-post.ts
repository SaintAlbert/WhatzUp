import { Component } from '@angular/core';
import {  ViewController, NavParams, IonicPage, NavController, PopoverController, Events } from 'ionic-angular';
import {GalleryProvider} from "../../providers/gallery/gallery";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

import Parse from "parse";
import _ from "underscore";

@IonicPage()
@Component({
    selector: 'page-modalpost',
    templateUrl: 'modal-post.html',
})
export class ModalPost {

    item: any;
    id: any;
    loading: boolean = true;
    query: any;
    data = [];
    user: any;
    username: any;
    eventName: string = 'photo';


    constructor(private navParams: NavParams,
        public viewCtrl: ViewController,
        private provider: GalleryProvider,
        private analytics: AnalyticsProvider,
        private popoverCtrl: PopoverController,
        private navCtrl: NavController,
        private events: Events,

    ) {
        // Google Analytics
        this.analytics.view('PhotoPage');
        this.id = this.navParams.get('id');
        this.user = Parse.User.current();
        this.username = this.user.get('username')
        
        this.load();
        
        //this.events.subscribe('photoItemClose', () => {
        //    this.viewCtrl.dismiss();
        //})
    }

    load() {
        
        if (this.navParams.get('item') !== null) {
            this.item = this.navParams.get('item');
            this.loading = false;
        } else {
            this.loading = true;
        this.provider.get(this.id).then(gallery => {
            console.log('gallery', gallery);
            this.item = gallery;
            this.loading = false;
        });
        }
    }


    ionViewWillEnter() {
         this.user = Parse.User.current();
         this.events.publish('photoItemShowHeader', true);
         this.events.subscribe('photoItemClose', () => {
             this.viewCtrl.dismiss();
         })
         //this.load();
        // this.hide = false;
        // this.loading = true;
        //this.provider.get(this.id).then(gallery => {
        //    console.log('gallery', gallery);
        //    this.item = gallery;
        //    this.loading = false;
        //});

        //if (this.navParams.get('item') !== null) {
        //    this.item = this.navParams.get('item');
        //    this.loading = false;
        //} else {
        //    this.loading = true;
        //    this.provider.get(this.id).then(gallery => {
        //        console.log('gallery', gallery);
        //        this.item = gallery;
        //        this.loading = false;
        //    });
        //}

    }

    openPopover(ev): void {
        this.popoverCtrl.create('PhotoListPopoverPage', { item: this.item }).present({ ev: ev });
    }

    openProfile(username: string): void {
        this.navCtrl.push('ProfilePage', { username: username })
        this.viewCtrl.dismiss();
    }
    dismiss() {
        //this.events.publish('photolistmodal:reload', null);
        this.viewCtrl.dismiss();
        this.events.publish('photoItemShowHeader', false);

    }





}