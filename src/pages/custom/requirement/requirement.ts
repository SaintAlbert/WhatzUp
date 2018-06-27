import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-requirement',
  templateUrl: 'requirement.html',
})
export class Requirement {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Requirement');
  }
  
   goBack(){
     this.navCtrl.pop();
   }

}
