import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController,NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class Verification {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Verification');
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 home() {
this.navCtrl.push('Home');
}

}
