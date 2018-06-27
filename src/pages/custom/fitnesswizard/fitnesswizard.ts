import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController,ModalController,Content,Slides,NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-fitnesswizard',
  templateUrl: 'fitnesswizard.html',
})
export class Fitnesswizard {

showPrev:any;
showNext:any;
currentIndex:any;
  slidertab:any;

@ViewChild(Content) content: Content;
@ViewChild('mySlider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {

this.currentIndex = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Fitnesswizard');
  }

  goBack(){
     this.navCtrl.pop();
   }

   goToNextSlide() {
  this.slider.slideNext();
  this.content.scrollToTop();
}
goToPrevSlide() {
  this.slider.slidePrev();
  this.content.scrollToTop();
}
slideChanged() {
 this.currentIndex = this.slider.getActiveIndex();
 this.slidertab = this.currentIndex;
console.log("Current index is", this.currentIndex);
}

  wizardsuccess() {
let modal = this.modalCtrl.create('Wizardsuccess');
modal.present();
}




}
