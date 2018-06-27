import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-projectlist',
  templateUrl: 'projectlist.html',
})
export class Projectlist {

  constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Projectlist');
  }
  
  
    presentPopover() {
    let popover = this.popoverCtrl.create('Wizardpopover');
    popover.present();
  }
  
   goBack(){
     this.navCtrl.pop();
   }
   
     feedback() {
this.navCtrl.push('Feedback');
}

}
