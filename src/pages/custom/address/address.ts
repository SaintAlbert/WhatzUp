import { Component } from '@angular/core';
import { IonicPage, NavController,ModalController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class Address {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Address');
  }

goBack(){
     this.navCtrl.pop();
   }

     payment() {
    this.navCtrl.push('Payment');
  }

   selectaddress() {
    this.navCtrl.push('Selectaddress');
  }



    newaddress() {
let modal = this.modalCtrl.create('Newaddress');
modal.present();
}




}
