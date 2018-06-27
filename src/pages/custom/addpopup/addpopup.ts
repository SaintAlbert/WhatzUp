import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController,NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-addpopup',
  templateUrl: 'addpopup.html',
})
export class Addpopup {
    serviceItem: any
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.serviceItem = this.navParams.get("serviceItem");
        console.log(this.serviceItem )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Addpopup');
  }

  getCode(code: string) {
      //console.log(code)
      return code.trim();
  }

  dismiss(){
	this.viewCtrl.dismiss();
  }

}
