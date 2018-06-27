import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-fitness',
  templateUrl: 'fitness.html',
})
export class Fitness {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FitnessPage');
  }

  goBack(){
     this.navCtrl.pop();
   }

   fitnesswizard() {
   this.navCtrl.push('Fitnesswizard');
   }


}
