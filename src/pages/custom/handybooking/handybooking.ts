import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
        selector: 'page-handybooking',
  templateUrl: 'handybooking.html',
})
export class HandyBooking {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Message');
  }
  
  chat() {
this.navCtrl.push('Chat');
}

}
