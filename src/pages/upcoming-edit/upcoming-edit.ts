import {Component, HostListener, ViewChild, ElementRef} from '@angular/core';
import {NavController, ModalController, Content, NavParams, ViewController, Events, IonicPage} from 'ionic-angular';
import {UpcomingProvider} from '../../providers/upcoming/upcoming';
import {AnalyticsProvider} from '../../providers/analytics/analytics';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import { postCategory, countryCurrency } from '../../config'
import * as moment from 'moment'


@IonicPage()
@Component({
    selector: 'upcoming-photo-edit',
    templateUrl: 'upcoming-edit.html'
})
export class UpcomingEditPage {
    @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }
    @ViewChild('textmsgId') element: ElementRef;
    @ViewChild(Content) content: Content
    priceArray: any = [{ 'label': '', Price: 0.0 }];
    postCategory: any = postCategory;
    countryCurrency: any = countryCurrency;
    // today: any = moment(new Date()).format('MMM DD, YYYY HH:mm');
    year: any = moment().format('YYYY')
    startDateValid: boolean
    endDateValid: boolean
    item: any;
    form: any = {
        title: '',
        description: '',
        privacity: '',
        category: '',
        categoryId: null,
        currencyId: null,
        currency: '',
        code: '',
        symbol: '',
        startDate: null,
        endDate: null,
        priceType: true,
        price: '',
        //vip: '',
        //executive: '',
        albumId: null,
        location: null,
        chargefee: 1.00,
        chargedispalyfee: '$1.00',
        publicfee: 1.00,
        frendshipfee: 0.00,
        contact:''
    };
    formCurrency: any = {
        currencyId: countryCurrency[104].id,
        currency: countryCurrency[104].currency,
        code: countryCurrency[104].code,
        symbol: countryCurrency[104].symbol,
    }
    image: any;
    location: any;
    addressSelected: boolean = true;
    startDate: any = new Date().toISOString()
    endDate: any = new Date().toISOString()

    constructor(public navCtrl: NavController,
        private navParams: NavParams,
        private provider: UpcomingProvider,
        private viewCtrl: ViewController,
        private events: Events,
        private analytics: AnalyticsProvider,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
    ) {
        // Google Analytics
        this.analytics.view('UpcomingEditPage');
    }

  
    ionViewWillLoad() {
        let item = this.navParams.get('item');
        this.item = item;
        this.form.id = item.id;
        this.form.title = item.title;
        this.form.privacity = item.privacity;

        this.form.description = item.description;
        this.form.category = item.category;
        this.form.categoryId = item.categoryId;
        this.form.currencyId = item.currencyId;
        this.form.currency = item.currency;
        this.form.code = item.code;
        this.form.symbol = item.symbol;
        this.form.startDate = item.startDate;
        this.form.endDate = item.endDate;
        this.form.priceType = item.priceType;
        this.form.price = item.price;
        this.priceArray = item.price;
        //this.form.vip = item.vip;
        //this.form.executive = item.executive;
        this.form.address = item.address;
        this.form.location = item.location;
        this.form.contact = item.contact;


        this.formCurrency.currencyId= item.currencyId
        this.formCurrency.currency = item.currency;
        this.formCurrency.code = item.code;
        this.formCurrency.symbol = item.symbol;
    


        this.events.subscribe('album:selected', album => this.form.albumId = album['id']);
        this.events.subscribe('address:selected', address => {
            this.form.address = address
            this.addressSelected = true;
        });

        this.startDate = item.startDate.toISOString()
        this.endDate = item.endDate.toISOString()
        this.startDateValid = false;
        this.endDateValid = false;
       
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
        this.events.unsubscribe('album:selected');
        this.events.unsubscribe('address:selected');
    }

    submit(form) {
        let today = moment(new Date().toISOString()).format('MM-DD-YYYY');
        let startdate = moment(this.startDate).format('MM-DD-YYYY');
        let enddate = moment(this.endDate).format('MM-DD-YYYY');
        if (this.addressSelected) {
            if (moment(startdate).isSameOrAfter(today) && moment(enddate).isSameOrAfter(startdate)) {
                if (form.valid) {
                    this.util.onLoading('Updating....');
                    this.provider.updatedUpcoming(this.form).then(() => {
                        //this.events.publish('home:reload', 1);
                        this.events.publish('upcoming-list-edit:reload');
                        this.util.endLoading();
                        this.viewCtrl.dismiss();
                    });
                }
            } else {
                this.util.translate('Event start or end date is invalid').then((res: string) => this.util.toast(res))
            }
        } else {
            this.util.translate('Address venue is required').then((res: string) => this.util.toast(res))
        }
    }

    dismiss(cancel?) {
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
