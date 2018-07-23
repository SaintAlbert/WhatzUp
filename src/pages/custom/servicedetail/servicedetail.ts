import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController,
    Events, Content, Slides, NavParams } from 'ionic-angular';
import {IonicUtilProvider} from "../../../providers/ionic-util/ionic-util";
import { handy, handycategory } from "../../../handyman-config";
import {HandyManProvider} from "../../../providers/handyman/handyman-service";
import {IHandyParams} from "../../../models/parse.params.model";
import _ from "underscore";
@IonicPage()
@Component({
    selector: 'page-allservice',
    templateUrl: 'servicedetail.html',
})
export class ServiceDetail {

    showPrev: any;
    showNext: any;
    currentIndex: any;

    @ViewChild(Content) content: Content;
    service: any = ""
    serviceItems: any = []
    serviceItem: any;
    cartItems: any = []

    id: any
    all: boolean = false;
    selectedIndex: any
    event: any = 'handyservice';

    params: IHandyParams = {
        limit: 10,
        page: 1,
        id: '',
        search: '',
        username: '',
        filter: '',
        hashtags: '',
        handyservice: '',
        handyproduct: '',
        //privacity:'public',
        words: '',
        cache: false,
        location: '',
        country: '',
    };

    moreItem: boolean = false;
    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    isIOS: boolean = false;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public viewCtrl: ViewController,
        private handyman: HandyManProvider,
        private util: IonicUtilProvider,
        private events: Events) {
        this.isIOS = this.util.isIOS;
        this.id = this.navParams.get("id");
        this.all = this.navParams.get("all")
        this.service = handy[this.id];
        if (this.all) {
            this.params.handyservice = this.service.name;
            this.params.handyproduct = '';
        } else {
            this.selectedIndex = this.navParams.get("index");
            this.serviceItem = handycategory[this.id].item[this.selectedIndex];
            this.params.handyservice = this.service.name;
            this.params.handyproduct = this.serviceItem.name;
        }

        // Server Request
        this.events.subscribe(this.event + ':params', (params: IHandyParams) => {
            //console.info(this.event + ':params', params);
            this.params = params;
            this.loadHand()
        });
        
        //this.loadHand();

    }

    loadHand(): Promise<any> {
        return new Promise((resolve, reject) => {
            if(this.params.page == 1) {
                this.serviceItems = [];
                this.loading = true;
            }
            this.handyman.feed(this.params).then((data) => {
                 console.log(data);
                if (data) {
                    this.showErrorView = false;
                    this.showEmptyView = false;
                    _.sortBy(data, 'createdAt').map(item =>
                        this.serviceItems.push(item)
                    );
                    this.events.publish(this.event + ':moreItem', true);
                    this.moreItem = true;
                }

                if (!this.serviceItems.length) {
                    this.showEmptyView = true;
                    this.moreItem = true;
                }

                this.loading = false;
                this.events.publish(this.event + ':complete', null);
                resolve(data);
                //console.log(data)

            }).catch(error => { })
        })
    }

    public doTry(): void {
        this.params.page = 1;
        this.showErrorView = false;
        this.loadHand();
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.event + ':complete');
        this.events.subscribe(this.event + ':complete', () => event.complete());

        this.sendParams();

    }

    public doRefresh(event?) {
        if (event) {
            event.complete();
        }
        this.doTry();
    }

    private sendParams(): void {
        this.events.publish(this.event + ':params', this.params);
    }



    getCode(code: string) {
        //console.log(code)
        return code;
    }

    ionViewDidLoad() {
        this.loadHand();
        console.log('ionViewDidLoad Allservice');
    }


    goBack() {
        this.navCtrl.pop();
    }

    onSelectHandyDetail(item) {
        //this.navCtrl.push('Handydetail', { item: item});
        let modal = this.modalCtrl.create('Handydetail', { item: item });
        modal.present();
        
    }


    summary() {
        this.navCtrl.push('Summary');
    }

    add(s) {
        let modal = this.modalCtrl.create('Addpopup', { serviceItem: s });
        modal.present();
    }


}
