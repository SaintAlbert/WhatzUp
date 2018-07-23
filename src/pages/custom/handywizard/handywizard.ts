import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController, Events, Content, Slides, NavParams } from 'ionic-angular';
import {IonicUtilProvider} from "../../../providers/ionic-util/ionic-util";
import {HandyManBookingProvider} from "../../../providers/handyman/handyman-booking";
import Parse from "parse";
import _ from "underscore";
import * as moment from 'moment'

@IonicPage()
@Component({
    selector: 'page-handywizard',
    templateUrl: 'handywizard.html',
})
export class HandyAppointmentwizard {

    showPrev: any;
    showNext: any;
    currentIndex: any;
    slidertab: any;
    item: any = {};
    curentUser: any;
    form: any = {
        requirment: '',
        appday: '',
        dateperiod:'',
        timeperiod: '',
        //handyId: '',
        formatted_address: null
    };

    bookingSchema = {
        words:'',
        title: '',
        users: [],
        seller: '',
        buyer: '',
        bookingType: '',
        bookingId: '',
        location: '',
        customerCharge: { charge: 0, fees: 0, total: 0 },
        sellerPayment: { amount: 0, fees: 0, total: 0 },
        checkIn: {},
        image:'',
        customerRequirement: {},
        amount: 0,
        totalCharge: 0,
        totalFees: 0,
        currency: '',
        created: Date.now,
        refrence: Math.random().toString(36).toUpperCase().slice(2),//new Date((new Date).getTime() + Math.floor(10 * Math.random()) * 60000),
        customerStripeId: '',
        sellerStipeAccId: '',
        active: false,
        completed: false,
        payLater: false,
        cancel: false,
        paid: false,
        captured: false,
        paymentTransfered: false,
        refund: false,
        refunded: 0,
        totalrefunded: 0,
        // Stripe charge ID corresponding to this ride.
        stripeChargeId: ''
    }


    @ViewChild(Content) content: Content;
   // @ViewChild('mySlider') slider: Slides;

    constructor(public navCtrl: NavController, public util: IonicUtilProvider,
        public viewCtrl: ViewController, private events: Events,
        public navParams: NavParams, public modalCtrl: ModalController,
        public service: HandyManBookingProvider) {
        this.item = this.navParams.get("item")
        this.currentIndex = 0;
        //this.form.handyId = this.item.id;
        this.curentUser = Parse.User.current();
        //this.bookingSchema.user = Parse.User.current();
        this.events.subscribe('address:selected', address => {
            this.form.formatted_address = address
        });
    }

    ionViewDidLoad() {
        let tenPercentFee = (parseInt(this.item.price) - this.amountForGetPercent(parseInt(this.item.price), 0.9));
        let customerPayAmmountTotal = (parseInt(this.item.price) + tenPercentFee);
        let sellerTakeAmount = (parseInt(this.item.price) - tenPercentFee);

        console.log('ionViewDidLoad Fitnesswizard');
        this.bookingSchema.customerCharge.charge = parseInt(this.item.price) 
        this.bookingSchema.customerCharge.fees = tenPercentFee;
        this.bookingSchema.customerCharge.total = customerPayAmmountTotal;
        this.bookingSchema.sellerPayment.amount = sellerTakeAmount;
        this.bookingSchema.sellerPayment.fees = tenPercentFee;
        this.bookingSchema.sellerPayment.total = (sellerTakeAmount + tenPercentFee);
        //this.bookingSchema.user = Parse.User.current();
        this.bookingSchema.seller = this.item.user.id;
        this.bookingSchema.buyer = this.curentUser.id;
        this.bookingSchema.users = [this.bookingSchema.seller, this.bookingSchema.buyer]
        //this.bookingSchema.sellerId = this.item.user.id;
        this.bookingSchema.bookingType = this.item.obj.className;
        this.bookingSchema.bookingId = this.item.id;
        this.bookingSchema.title = this.item.title;
        this.bookingSchema.words = this.item.words;
        this.bookingSchema.amount = this.item.price;
        this.bookingSchema.currency = this.item.code;
        this.bookingSchema.location = this.item.location;
        this.bookingSchema.image = this.item.image;
        

       // console.log(this.bookingSchema);
        //console.log(this.item);
        
    }

    amountForGetPercent(a, d) {
        return (a * d);
    };

    goBack() {
        this.navCtrl.pop();
    }
    backOne(d) {
        this.currentIndex = d;
    }
    goToNextSlide1() {
        this.currentIndex = 1;
    }
    goToNextSlide2() {
        if (!this.form.requirment) {
            this.util.translate('Enter some requirements').then((res: string) => this.util.toast(res))
            return false;
        }
        this.currentIndex = 2;
    }
    goToNextSlide3() {
        var today = moment();
       
        if (!this.form.dateperiod) {
            this.util.translate('Pick booking date').then((res: string) => this.util.toast(res))
            return false;
        }
        var pickDate = moment(this.form.dateperiod);
        if (pickDate.isBefore(today))
        {
            this.util.translate('Booking date must be in future date').then((res: string) => this.util.toast(res))
            return false;
        }
        if (!this.form.timeperiod) {
            this.util.translate('Pick your booking time period').then((res: string) => this.util.toast(res))
            return false;
        }
        this.currentIndex = 3;
    }


    dismiss() {
        //this.events.publish('photolistmodal:reload', null);
        this.viewCtrl.dismiss();
    }
   

    wizardsuccess() {
        if (!this.form.formatted_address) {
            this.util.translate('Enter your locality').then((res: string) => this.util.toast(res))
            return false;
        }
        this.util.onLoading("Wait..creating booking ");
        this.bookingSchema.customerRequirement = this.form;
        this.service.createHandyBooking(this.bookingSchema)
            .then((data) => {
             
                let modal = this.modalCtrl.create('Wizardsuccess', { item: this.bookingSchema});
                modal.present();
                this.util.endLoading();
                this.dismiss();
            });
        //let modal = this.modalCtrl.create('Payment', { item: this.item, form: this.bookingSchema });
        //modal.present();
        //this.dismiss();
        // let modal = this.modalCtrl.create('Wizardsuccess');
        // modal.present();
    }




}
