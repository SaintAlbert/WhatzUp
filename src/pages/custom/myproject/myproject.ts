import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-myproject',
  templateUrl: 'myproject.html',
})
export class Myproject {
tab:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Myproject');
	 this.tab = "active";
  }
  
  tab_swap(type) {
      this.tab = type;
     }
	 
	 
	 
projectlist() {
this.navCtrl.push('Projectlist');
}

}
