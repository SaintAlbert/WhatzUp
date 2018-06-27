import { Component } from '@angular/core';
import { IonicPage, NavController,ModalController,ViewController,NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-wizardpopover',
  templateUrl: 'wizardpopover.html',
})
export class Wizardpopover {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Wizardpopover');
  }
  
    requirement() {
this.navCtrl.push('Requirement');
this.viewCtrl.dismiss();
}


  cancel() {
let modal = this.modalCtrl.create('Cancel');
modal.present();
this.viewCtrl.dismiss();
}

}

