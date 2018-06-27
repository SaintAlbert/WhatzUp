import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class Message {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Message');
  }
  
  chat() {
this.navCtrl.push('Chat');
}

}
