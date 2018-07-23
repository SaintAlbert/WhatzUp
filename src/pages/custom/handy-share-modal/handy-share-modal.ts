import {Component, ViewChild, ElementRef, Renderer} from '@angular/core';
import {NavParams, ViewController, ModalController, Events, IonicPage, AlertController } from 'ionic-angular';
import {AnalyticsProvider} from '../../../providers/analytics/analytics';
import {IonicUtilProvider} from "../../../providers/ionic-util/ionic-util";
import {HandyManProvider} from "../../../providers/handyman/handyman-service";
import {IonPhotoService} from "../../../modules/ion-photo/ion-photo-service";
import { handy, handycategory } from "../../../handyman-config";
import {countryCurrency} from "../../../config";

import * as _ from "underscore";
//interface EnumPDescriptionItem { label: string }
//import Parse from "parse";
//declare var Parse: any;
@IonicPage()
@Component({
    selector: 'handy-share-modal',
    templateUrl: 'handy-share-modal.html'
})

export class HandyManShareModalPage {

    handyCurrency: any;
    // label: 'Monthly Wax and Groom',
    //{ 'label': '' }
    descArray: any = [{ label: '' }];
    openingDay: any = [];
    openingTime: any = { open: '00:00', close: '00:00' };
    openingDayArray = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    form = {
        title: '',
        handyHeader: '',
        handyHeaderId: '',
        handyKey: '',
        handyPackage: this.descArray,
        iconHeader: '',
        iconKey: '',
        country: '',
        privacity: 'public',
        image: null,
        address: null,
        openingDay: this.openingDay,
        openingTime: this.openingTime,
        venue: '',
        location: null,
        price: 0, currencyId: 104, currency: '', symbol: '', code: '', min: '0',
        commentsTotal: 0,
        likesTotal: 0,
        isLiked: false,
        comments: [],
        offerHomeService: false,
    };

    currencyId: any = 104

    //location: any;
    taskKey: any;
    address: any = {};
    eventNumber: any;
    service: any;
    itemCategory: any;
    _eventName: string = 'handytaskshare:crop';
    _cordova: boolean = false;
    @ViewChild('inputFile') input: ElementRef;

    constructor(private navparams: NavParams,
        private viewCtrl: ViewController,
        private events: Events,
        private analytics: AnalyticsProvider,
        private util: IonicUtilProvider,
        private handyman: HandyManProvider,
        private ionPhoto: IonPhotoService,
        private modalCtrl: ModalController,
        private render: Renderer,
        private alertCtrl: AlertController,

    ) {
        //console.log(this.taskcurrency)
        // Google Analytics
        this.analytics.view('HandyShareModalPage');
        this._cordova = this.util.cordova;
        this.eventNumber = this.navparams.get('eventNumber');

        // if (this.eventNumber) {
        this.form.handyHeaderId = this.eventNumber;
        this.service = handy[this.eventNumber];
        this.itemCategory = handycategory[this.eventNumber];
        this.form.iconHeader = this.service.src;
        this.form.handyHeader = this.service.name;
        this.form.handyKey = this.itemCategory.item[0].name
        this.form.iconKey = this.itemCategory.item[0].src;
        this.handyCurrency = countryCurrency;
        let result = this.handyCurrency[this.currencyId - 1];
        this.form.currencyId = this.currencyId;
        this.form.code = result.code.trim();
        this.form.symbol = result.symbol.trim();
        this.form.currency = result.currency.trim();
        //this.openingDay= ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        //var item = this.handycatdata[id].item[index];
        // } else { this.dismiss() }

        this.events.subscribe('address:selected', address => {
            this.form.address = address;
            this.form.country = address.country;
        });
        this.events.subscribe(this._eventName, image => this.form.image = image);
    }

    ionViewWillEnter() {
    }

    ngOnDestroy() {
        this.events.unsubscribe(this._eventName);
        this.events.unsubscribe('album:selected');
        this.events.unsubscribe('address:selected');
    }

    addPicture() {
        if (this._cordova) {
            this.ionPhoto.open().then((image) => {
                this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
            })
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
    }

    onChange(event) {
        //console.log(event)
        let files = event.srcElement.files;
        let image = files[0];
        let reader = new FileReader();
        if (image) {
            reader.onload = (evt) => {
                if (evt) {
                    let image = evt.srcElement['result'];
                    this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
                }
            };
            reader.readAsDataURL(image);
        }
    }

    submit() {
        //alert(this.form.price)
        let isValid = true;
        if (!this.form.image) {
            this.util.toast("Upload product photo")
            isValid = false
            return false;
        }
        if (!this.form.handyKey) {
            this.util.toast("Pick product type")
            isValid = false
            return false;
        }
        if (!this.form.title) {
            this.util.toast("Enter product title")
            isValid = false
            return false;
        }
        if (this.descArray.length == 0) {
            this.util.toast("Product description cannot be empty")
            isValid = false
            return false;
        }

        if (!this.form.venue) {
            this.util.toast("Add shop venue")
            isValid = false
            return false;
        }

        if (!this.form.address) {
            this.util.toast("Add product address")
            isValid = false
            return false;
        }


        if (!this.form.currency) {
            this.util.toast("Pick price currency")
            isValid = false
            return false;
        }

        if (isNaN(this.form.price)) {
            this.util.toast("Enter positive price value ")
            isValid = false
            return false;
        }

        if (this.form.price == 0) {
            this.util.toast("Enter product price and must not zero")
            isValid = false
            return false;
        }

        if (!this.form.privacity) {
            this.util.toast("Pick product privacy")
            isValid = false
            return false;
        }

        // if (!this.openingDay) {
        if (this.openingDay.length == 0) {
            this.util.toast("Pick opening days")
            isValid = false
            return false;
        }
        if (this.openingTime.open == '00:00') {
            this.util.toast("Pick service opening time")
            isValid = false
            return false;
        }
        if (this.openingTime.close == '00:00') {
            this.util.toast("Pick service opening time")
            isValid = false
            return false;
        }


        this.descArray.forEach((v, k) => {
            if (this.descArray[k].label == '') {
                isValid = false
                this.util.toast("One or more product description cannot be empty")
            } else {
                isValid = true
            }
        })

        if (isValid) {
            //console.log(this.form)
            this.util.onLoading('Wait... handy creating', 5000);
            this.form.openingDay = this.openingDay;
            this.form.openingTime = this.openingTime;
            this.handyman.createHandyTask(this.form).then(() => {
                this.presentAlert();
                this.util.endLoading();
            });
        }

    }

    Add() {
        let text = { label: '' };
        this.descArray.push(text);
    }
    Remove(index) {
        if (index > -1) {
            this.descArray.splice(index, 1);
        }
    }


    onCurrencyChange() {
        let result = this.handyCurrency[this.currencyId - 1];
        this.form.currencyId = result.currencyId;
        this.form.code = result.code.trim();
        this.form.symbol = result.symbol.trim();
        this.form.currency = result.currency.trim();
    }
    onProductChange(name) {
        for (var i = 0; i < this.itemCategory.item.length; i++) {
            if (this.itemCategory.item[i].name == name)
                this.form.iconKey = this.itemCategory.item[i].src;
        }
        //alert(id)
        //this.form.iconKey = this.itemCategory.item[id].src
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    presentAlert() {
        let alert = this.alertCtrl.create({
            title: 'HandyMan',
            subTitle: 'HandyMan succefully created. Go to MyHandy to start monitoring user interaction, purchases and appointment',
            buttons: [{
                text: 'Done',
                role: 'cancel',
                handler: () => {
                    this.dismiss();
                }
            }]
        });
        alert.present();
    }


}
