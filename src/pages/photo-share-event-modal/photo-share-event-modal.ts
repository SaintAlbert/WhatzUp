
import {Component, Directive, HostListener, ViewChild, ElementRef, } from '@angular/core';
import {NavParams, Content, ViewController, Events, IonicPage, ModalController} from 'ionic-angular';
import {AnalyticsProvider} from '../../providers/analytics/analytics';
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";


// Extra
import { postCategory, countryCurrency } from '../../config'
import * as moment from 'moment'

//import Parse from "parse";
//declare var Parse: any;
@IonicPage()
@Component({
    selector: 'photo-share-event-modal',
    templateUrl: 'photo-share-event-modal.html',

})
export class PhotoShareEventModalPage {
    @HostListener('input', ['$event.target'])

    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }
    @ViewChild('textmsgId') element: ElementRef;
    @ViewChild(Content) content: Content
    postCategory: any = postCategory;
    countryCurrency: any = countryCurrency;
    // today: any = moment(new Date()).format('MMM DD, YYYY HH:mm');
    year: any = moment().format('YYYY')
    startDateValid: boolean
    endDateValid: boolean
    priceArray: any = [{ 'label': '', Price: 0.0 }];

    form = {
        title: '',
        description: '',
        privacity: 'public',
        category: postCategory[11].slug,
        categoryId: postCategory[11].id,
        currencyId: countryCurrency[104].id,
        currency: countryCurrency[104].currency,
        code: countryCurrency[104].code,
        symbol: countryCurrency[104].symbol,
        //currencyId:0,
        //currency: '',
        //code: '',
        //symbol: '',
        startDate: new Date(),//new Date().toISOString(),
        endDate: new Date(),//new Date().toISOString(),
        priceType: true,
        price: [],
        //vip: '',
        //executive: '',
        image: null,
        address: {},
        albumId: null,
        location: null,
        chargefee: 1.00,
        chargedispalyfee: '$1.00',
        publicfee: 1.00,
        frendshipfee: 0.00,
        contact: '',
    };
    formCurrency: any = {
        currencyId: countryCurrency[104].id,
        currency: countryCurrency[104].currency,
        code: countryCurrency[104].code,
        symbol: countryCurrency[104].symbol,
    }
    location: any;
    address: any = {};
    addressSelected: boolean = false;
    startDate: any = new Date().toISOString()
    endDate: any = new Date().toISOString()
    album: any;
    eventName: string;
    _eventName: string = 'photoshare:crop';
    textarea: HTMLTextAreaElement;
    //textarea: any= HTMLTextAreaElement;

    constructor(private navparams: NavParams,
        private viewCtrl: ViewController,
        private util: IonicUtilProvider,
        private events: Events,
        private analytics: AnalyticsProvider,
        private modalCtrl: ModalController,

    ) {
        // Google Analytics
        this.analytics.view('PhotoShareEventModalPage');

        this.form.image = this.navparams.get('base64');
        this.eventName = this.navparams.get('eventName');
        this.album = this.navparams.get('album');

        if (this.album) {
            this.form.albumId = this.album.id;
        }

        this.events.subscribe('album:selected', album => this.form.albumId = album['id']);
        this.events.subscribe('address:selected', address => {
            this.form.address = address
            this.addressSelected = true;
        });


    }

    adjust(): void {
        this.element.nativeElement.style.overflow = 'hidden';
        //this.element.nativeElement.style.position = 'relative'
        this.element.nativeElement.style.height = 'auto';
        this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
    }



    priceSet(data: boolean) {
        if (data) {
            this.form.priceType = data
        } else {
            this.form.priceType = data
        }
    }

    onCategoryChange() {
        let result = this.postCategory[this.form.categoryId]
        this.form.category = result.slug;
    }

    onCurrencyChange() {
        let result = this.countryCurrency[this.form.currencyId - 1];
        this.form.code = result.code.trim();
        this.form.symbol = result.symbol.trim();
        this.form.currency = result.currency.trim();
    }
    onPrivacyChange() {
        if (this.form.privacity == 'public') {
            this.form.chargefee = 1.00;
            this.form.chargedispalyfee = '$1.00';
        }
        if (this.form.privacity == 'followers') {
            this.form.chargefee = 0.00;
            this.form.chargedispalyfee = 'Free';
        }
        if (this.form.privacity == 'me') {
            this.form.chargefee = 0.00;
            this.form.chargedispalyfee = 'Free';
        }
    }

    dateStartChanged(data) {
        //startDate: string = new Date().toISOString()
        //endDate: string = new Date().toISOString()
        let today = moment(new Date().toISOString()).format('MM-DD-YYYY');
        let startdate = moment(this.startDate).format('MM-DD-YYYY');
        if (moment(startdate).isSameOrAfter(today)) {
            this.startDateValid = true;
            this.form.startDate = new Date(this.startDate)
        } else {
            this.startDateValid = false;
            this.startDate = new Date().toISOString()
            this.form.startDate = new Date();//new Date().toISOString(),
            this.util.translate('Start date and time is invalid').then((res: string) => this.util.toast(res))
        }
    }
    dateEndChanged(data) {
        let today = moment(new Date().toISOString()).format('MM-DD-YYYY');
        let startdate = moment(this.startDate).format('MM-DD-YYYY');
        let enddate = moment(this.endDate).format('MM-DD-YYYY');
        if (moment(startdate).isSameOrAfter(today) && moment(enddate).isSameOrAfter(startdate)) {
            this.endDateValid = true;
            this.form.endDate = new Date(this.endDate)
        } else {
            this.endDateValid = false;
            if (moment(startdate).isSameOrAfter(enddate)) {
                this.form.endDate = this.form.startDate;
            } else {
                this.endDate = new Date().toISOString()
                this.form.endDate = new Date();//new Date().toISOString(),
                //this.form.endDate = new Date()//new Date().toISOString()
            }
            this.util.translate('End date and time is invalid').then((res: string) => this.util.toast(res))
        }
    }

    ngOnDestroy() {
        this.events.unsubscribe(this._eventName);
        this.events.unsubscribe('album:selected');
        this.events.unsubscribe('address:selected');
    }

    submit(form) {
        //console.log(this.form.address.formatted_address)
        if (this.addressSelected) {
            if (this.startDateValid && this.endDateValid) {
                if (form.valid) {
                    //if (this.form.privacity == 'public') {
                    // let modal = this.modalCtrl.create('UpcomingCardModalPage', { form: this.form });
                    //    modal.onDidDismiss(form => {
                    //        if (form.isSuccess) {
                    //            this.events.unsubscribe(this.eventName);
                    //            this.viewCtrl.dismiss({ form: this.form });
                    //        }
                    //    });
                    // modal.present()

                    //} else {

                    this.events.unsubscribe(this.eventName);
                    this.viewCtrl.dismiss({ form: this.form });
                    // }
                }
                if (this.form.title == '' || this.form.description == '') { this.util.translate('Title and Description required ').then((res: string) => this.util.toast(res)) }
            } else {
                this.util.translate('Event start or end date is invalid').then((res: string) => this.util.toast(res))
            }
        } else {
            this.util.translate('Address venue is required').then((res: string) => this.util.toast(res))
        }

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    addPrice() {
        let modal = this.modalCtrl.create('PriceModalComponent', { priceArray: this.priceArray, currency: this.formCurrency });
        modal.onDidDismiss(form => {
            if (form != null && (form.anArray && form.anArray.length > 0)) {
                this.priceArray = form.anArray;
                this.formCurrency = form.currency;
                this.form.priceType = false;
                this.form.currencyId = form.currency.currencyId
                this.form.code = form.currency.code.trim();
                this.form.symbol = form.currency.symbol.trim();
                this.form.currency = form.currency.currency.trim();
                this.form.price = form.anArray;

                this.scrollToBottom();
                console.log(this.priceArray)
            }
            else {
                this.form.priceType = true;
            }
        });
        modal.present()

    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.content._scroll) {
                this.content.scrollToBottom(0)
            }
        }, 100)
    }

    getCode(code) {
        //console.log(code)
        return code.trim();
    }


}
