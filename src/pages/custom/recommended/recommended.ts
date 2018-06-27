import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController,Content,Slides,NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-recommended',
  templateUrl: 'recommended.html',
})
export class Recommended {

showPrev:any;
showNext:any;
currentIndex:any;

 @ViewChild(Content) content: Content;
@ViewChild('mySlider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Recommended');
  }
  
  
 allservice(id) {
this.navCtrl.push('Allservice',{id : id});
}
  goBack(){
     this.navCtrl.pop();
   }


}
