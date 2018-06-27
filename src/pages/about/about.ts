import {Component} from "@angular/core";
import {IonicPage, NavParams, ViewController} from "ionic-angular";


@IonicPage()
@Component({
  selector   : 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad About');
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

}
