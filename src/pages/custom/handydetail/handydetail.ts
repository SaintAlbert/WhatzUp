import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController,Content, Slides,
    NavParams, ModalController,Events} from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-handydetail',
    templateUrl: 'handydetail.html',
})
export class Handydetail {
    item: any = {};


    constructor(public navCtrl: NavController, public navParams: NavParams,
        private modalCtrl: ModalController, private events: Events, public viewCtrl: ViewController,) {
        this.item = this.navParams.get("item")

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    ionViewWillEnter() {
        this.item = this.navParams.get("item")
        console.log('ionViewDidLoad Recommended', this.item);
    }

    openProfile(username: string): void {
        this.navCtrl.push('ProfilePage', { username: username })
    }

    openComments(): void {
        let modal = this.modalCtrl.create('HandyCommentModalPage', { handyId: this.item.id });//.present();
        modal.onDidDismiss(() => {
           
        });
        modal.present()
    }

    bookAppointment(item) {
        let modal = this.modalCtrl.create('HandyAppointmentwizard', { item: this.item });
        modal.present();
        this.dismiss();
       // this.navCtrl.push('HandyAppointmentwizard', { item: item});
    }
    //C:\Users\podunwo-albert\Documents\Philip\HandyPackage\handyman\src\pages\fitnesswizard

   



}
