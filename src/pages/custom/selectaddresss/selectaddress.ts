import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-selectaddress',
  templateUrl: 'selectaddress.html',
})
export class Selectaddress {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Selectaddress');
  }


    dismiss() {
   this.viewCtrl.dismiss();
 }

    newaddress() {
let modal = this.modalCtrl.create('Newaddress');
modal.present();
}


goBack(){
     this.navCtrl.pop();
   }

}
