import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {APP_NAME} from '../../config'

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html'
})
export class TermsPage {
  appName: string = APP_NAME;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

}
