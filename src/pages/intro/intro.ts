import {Component} from "@angular/core";
import {Events, IonicPage, MenuController, ModalController, NavController} from "ionic-angular";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
const SLIDES = require('./intro.slides').SLIDES;

@IonicPage({
  segment: 'intro'
})
@Component({
  selector   : 'page-intro',
  templateUrl: 'intro.html'
})

export class IntroPage {
  slides: any;
  showSkip              = true;
  device                = 'android';
  currentSlider: number = 0;

  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public modalCtrl: ModalController,
              private events: Events,
              private analytics: AnalyticsProvider,) {

    this.events.subscribe('auth:close', () => this.onTabsPage())
    // Google Analytics
    this.analytics.view('IntroPage');
    this.slides = SLIDES;
  }

  modalLanguage(): void {
    this.modalCtrl.create('LanguageModalPage').present();
  }

  onSkip(slide) {
    slide.slideTo(this.slides.length + 1, 1000);
    this.showSkip = false;
  }

  onLogin() {
    return this.navCtrl.push('AuthLoginPage', {successPage: 'TabsPage'});
  }

  onRegister() {
    return this.navCtrl.push('AuthRegisterPage', {successPage: 'TabsPage'});
  }

  onTerms() {
    return this.navCtrl.push('TermsPage');
  }

  onTabsPage() {
    return this.navCtrl.setRoot('TabsPage');
  }

  onSlideChangeStart(event) {
    this.currentSlider = event.getActiveIndex();
    this.showSkip      = (this.currentSlider == this.slides.length) ? false : true;
  }

}
