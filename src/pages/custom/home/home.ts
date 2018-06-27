
import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, NavController, ModalController, Content, NavParams } from 'ionic-angular';
import { handy } from "../../../handyman-config";
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class Home {

  handydata: any = handy;

  @ViewChild(Content) content: Content;
  scrollPosition: number = 0;


  constructor(private app: App, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home');
  }

  location() {
    let modal = this.modalCtrl.create('Location');
    modal.present();
  }


  service(id) {
    //this.navCtrl.push('Service', { id: id });
    this.app.getRootNav().push('Service', { id: id });
  }

  fitness() {
    //this.navCtrl.push('Fitness');
    this.app.getRootNav().push('Fitness');
  }

  recommended() {
    //this.navCtrl.push('Recommended');
    this.app.getRootNav().push('Recommended');
  }





}
