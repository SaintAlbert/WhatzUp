import { Component } from '@angular/core';
import { IonicPage, NavController,PopoverController,NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wizardsuccess',
  templateUrl: 'wizardsuccess.html',
})
export class Wizardsuccess {

  constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Wizardsuccess');
  }
  
    presentPopover() {
    let popover = this.popoverCtrl.create('Wizardpopover');
    popover.present();
  }
  
  
  
  goBack(){
     this.navCtrl.pop();
   }

}
