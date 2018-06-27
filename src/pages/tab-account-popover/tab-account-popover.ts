import {Component} from '@angular/core';
import {IonicPage, NavController, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
    selector   : 'page-tab-account-popover',
    templateUrl: 'tab-account-popover.html'
})
export class TabAccountPopoverPage {

    constructor(private navCtrl: NavController,
                private viewCtrl: ViewController) {}

    close() {
        this.viewCtrl.dismiss();
    }

}
