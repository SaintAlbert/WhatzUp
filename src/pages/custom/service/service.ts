import { Component, ViewChild } from '@angular/core';
import { IonicPage, App, NavController, Content, Slides, NavParams } from 'ionic-angular';
import { handy, handycategory } from "../../../handyman-config";
@IonicPage()
@Component({
    selector: 'page-service',
    templateUrl: 'service.html',
})
export class Service {
    handydata: any = handy;
    handycatdata: any = handycategory;
    showPrev: any;
    showNext: any;
    currentIndex: any;

    @ViewChild(Content) content: Content;
    @ViewChild('mySlider') slider: Slides;

    slidertab: any;

    constructor(public app:App,public navCtrl: NavController, public navParams: NavParams) {

        let id = this.navParams.get("id");
        this.slidertab = id;
        setTimeout(() => {
            this.goToSlide(id);
        }, 500)
        
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Service');
    }

    goToSlide(id) {
        this.slider.slideTo(id, 500);
    }

    slideChanged() {
        let currentIndex = this.slider.getActiveIndex();
        this.slidertab = currentIndex;
        console.log("Current index is", currentIndex);
    }

    openService(id, index) {
        this.app.getRootNav().push('ServiceDetail', { id: id, index: index, all: false});
    }
    openAllService(id) {
        this.app.getRootNav().push('ServiceDetail', { id: id, all: true });
    }

    goBack() {
        this.navCtrl.pop();
    }

}
