import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ViewController} from "ionic-angular";

@IonicPage()
@Component({
  selector   : 'page-photo-popover',
  templateUrl: 'photo-popover.html',
})
export class PhotoPopoverPage {

  constructor(public navCtrl: NavController,
              private viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoPopover');
  }

  blockPhoto() {
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
