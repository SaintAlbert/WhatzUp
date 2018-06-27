import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-newaddress',
  templateUrl: 'newaddress.html',
})
export class Newaddress {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Newaddress');
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
