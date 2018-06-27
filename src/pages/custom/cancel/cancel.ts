import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-cancel',
  templateUrl: 'cancel.html',
})
export class Cancel {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Cancel');
  }
  
  
 dismiss() {
   this.viewCtrl.dismiss();
 }
}
