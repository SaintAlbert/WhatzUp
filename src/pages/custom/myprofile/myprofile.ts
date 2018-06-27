import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
    templateUrl: 'myprofile.html',
})
export class MyProfile {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }

      editprofile() {
let modal = this.modalCtrl.create('Editprofile');
modal.present();
}


}
