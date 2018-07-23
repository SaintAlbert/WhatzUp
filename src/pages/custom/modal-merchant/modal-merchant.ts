import { Component, ViewChild } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ViewController, Content, Slides, NavParams, IonicPage, NavController, PopoverController, Events } from 'ionic-angular';
import {AnalyticsProvider} from "../../../providers/analytics/analytics";
import {countryCurrency, country, PARSE_SERVER_URL} from "../../../config";
import {IonicUtilProvider} from "../../../providers/ionic-util/ionic-util";


import Parse from "parse";
import _ from "underscore";

@IonicPage()
@Component({
    selector: 'page-modalmerchant',
    templateUrl: 'modal-merchant.html',
})
export class ModalMerchant {

    item: any;

    user: any = {};
    username: any;
    currencyId: any;
    countryCurrency: any = countryCurrency;
    country: any = country;
    @ViewChild(Content) content: Content;
    @ViewChild('mySlider') slider: Slides;
    showPrev: any;
    showNext: any;
    currentIndex: any=0;
    slidertab: any;

    constructor(private navParams: NavParams,
        public viewCtrl: ViewController,
        private analytics: AnalyticsProvider,
        private popoverCtrl: PopoverController,
        private navCtrl: NavController,
        private events: Events,
        private util: IonicUtilProvider,
        private iab: InAppBrowser,

    ) {
        this.user = this.navParams.get('data');
        this.currentIndex = 0;
        this.events.subscribe('address:selected', address => {
            this.user.address = address;
            this.user.city = address.city
            this.user.country = address.country
            this.user.postalCode = address.zipcode
            console.log(this.user)
        });

    }



    ionViewWillEnter() {
        //this.url = 'https://dashboard.stripe.com?output=embed'
        //this.user = Parse.User.current();
        //console.log(this.user)
    }

    dismiss() {
        //this.events.publish('photolistmodal:reload', null);
        this.viewCtrl.dismiss();
    }

    onCurrencyChange() {
        let result = countryCurrency[this.currencyId];
        this.user.currency = result.currency.trim();
        this.user.currencycode = result.code.trim();
        this.user.currencyId = result.id;
       // console.log(result)
        //console.log(this.user)
    }

     onTerms(): void {
        this.navCtrl.push('TermsPage');
    }

     goToNextSlide() {
         this.slider.slideNext();
         this.content.scrollToTop();
     }
     goToPrevSlide() {
         this.slider.slidePrev();
         this.content.scrollToTop();
     }
     slideChanged() {
         this.currentIndex = this.slider.getActiveIndex();
         this.slidertab = this.currentIndex;
         console.log("Current index is", this.currentIndex);
     }
  

     submitValidateNext() {
         //console.log(this.user)
         if (!this.user.firstName || !this.user.lastName) {
             this.util.translate('First and last name required').then((res: string) => this.util.toast(res))
             return false
         }
         //DOBdate
         if (!this.user.email || !this.util.validEmail(this.user.email)) {
             this.util.translate('Email address required or invalid email').then((res: string) => this.util.toast(res))
             return false
         }
         if (!this.user.phone) {
             this.util.translate('Phone number required').then((res: string) => this.util.toast(res))
             return false
         }
         if (!this.user.currency) {
             this.util.translate('Pick your currency').then((res: string) => this.util.toast(res))
             return false
         }

         if (!this.user.address) {
             this.util.translate('Address required').then((res: string) => this.util.toast(res))
             return false
         }
         if (!this.user.countryISO) {
             this.util.translate('Pick your country').then((res: string) => this.util.toast(res))
             return false
         }

         this.currentIndex = 1;

        // this.goToNextSlide();
         //const browser = this.iab.create(PARSE_SERVER_URL + 'authorize?user=' + JSON.stringify(this.user));
         //this.dismiss();
         //if (!this.user.businessName) {
         //    this.user.businessName
         //} 

     }

     backOne(d) {
         this.currentIndex = d;
     }

     goToNext() {
         this.currentIndex = 2;
     }

    submit() {
        //console.log(this.user)
        if (!this.user.firstName || !this.user.lastName) {
            this.util.translate('First and last name required').then((res: string) => this.util.toast(res))
            return false
        }
        //DOBdate
        if (!this.user.email || !this.util.validEmail(this.user.email)) {
            this.util.translate('Email address required or invalid email').then((res: string) => this.util.toast(res))
            return false
        }
        if (!this.user.phone) {
            this.util.translate('Phone number required').then((res: string) => this.util.toast(res))
            return false
        }
        if (!this.user.currency) {
            this.util.translate('Pick your currency').then((res: string) => this.util.toast(res))
            return false
        }
       
        if (!this.user.address) {
            this.util.translate('Address required').then((res: string) => this.util.toast(res))
            return false
        }
        if (!this.user.countryISO) {
            this.util.translate('Pick your country').then((res: string) => this.util.toast(res))
            return false
        }

        //this.goToNextSlide();
        const browser = this.iab.create(PARSE_SERVER_URL + 'authorize?user=' + JSON.stringify(this.user));
        //this.dismiss();
        //if (!this.user.businessName) {
        //    this.user.businessName
        //} 

    }




}