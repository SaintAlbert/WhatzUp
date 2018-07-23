import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { IonicUtilProvider } from "../../../providers/ionic-util/ionic-util";
import {UserProvider} from "../../../providers/user/user";
import {HandyManBookingProvider} from "../../../providers/handyman/handyman-booking";
import {IHandyGetParams} from "../../../models/parse.params.model";

declare const window: any;
import Parse from "parse";
import _ from "underscore";


@IonicPage()
@Component({
    selector: 'page-myproject',
    templateUrl: 'myproject.html',
})
export class Myproject {
    data = {
        userId: '',
        phone:'',
        email: '',
        type: 'individual',
        productType: 'handy',
        firstName: '',
        lastName: '',
        address: '',
        postalCode: '',
        countryISO: '',
        DOBdate:'',
        city: '',
        country: '',
        currency: '',
        currencycode: '',
        currencyId: '',
        created: false,
        businessName: '',
        stripeAccountId: '',
        Active: false
    };
    params: IHandyGetParams = {
        limit: 24,
        page:1,
        mybooking : true
    }; 
    image: any;
    url: any;
    user: any;
    username: any;
    isRegister:boolean=false;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        public modalCtrl: ModalController, public events: Events,
        private iab: InAppBrowser, private util: IonicUtilProvider,
        private User: UserProvider,
        private booking: HandyManBookingProvider) {

        //if (this.username == user.get('username')) {
        //    //this.canEdit = true;
        //}
        this.user = Parse.User.current();
        this.params.user = this.user.id;
        this.booking.getBooking(this.params).then((data) => {
            console.log(data);
            //alert(data);
        })
    }

    ionViewDidLoad() {
   
     
        this.User.getProfile(this.user.get('username')).then(profile => {
            this.image = profile.photo; 
            this.data.userId = profile.id;
            this.data.firstName = profile.name;
            this.data.lastName = profile.name;
           
           
        }).catch(this.util.toast);
       
        //console.log( this.data);
        ////this.tab = "active";
    }

    tab_swap(type) {
       // this.tab = type;
    }

    projectlist() {
        //const browser = this.iab.create('https://ionicframework.com/');
        this.modalCtrl.create('ModalMerchant',{data: this.data }).present();
        //this.navCtrl.push('Projectlist');
    }

}
