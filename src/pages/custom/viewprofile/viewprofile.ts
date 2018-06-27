import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-viewprofile',
  templateUrl: 'viewprofile.html',
})
export class Viewprofile {
tab:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Viewprofile');
     this.tab = "media";
  }

  tab_swap(type) {
      this.tab = type;
     }

    dismiss() {
   this.viewCtrl.dismiss();
 }

}
