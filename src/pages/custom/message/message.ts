import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
    selector: 'page-message',
    templateUrl: 'message.html',
})
export class Message {

    constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Message');
    }

    chat() {
        this.app.getRootNav().push('Chat');
    }

}
