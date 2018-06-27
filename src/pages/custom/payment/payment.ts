import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class Payment {
tab:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Payment');
    this.tab = "active";
  }



  tab_swap(type) {
      this.tab = type;
     }

  goBack(){
     this.navCtrl.pop();
   }

}
