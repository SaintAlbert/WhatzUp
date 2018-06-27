import {Component} from "@angular/core";
import {App, IonicPage, ModalController, NavController} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {UserProvider} from "../../providers/user/user";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

@IonicPage()
@Component({
  selector   : 'page-tab-account-settings',
  templateUrl: 'tab-account-settings.html'
})
export class TabAccountSettingsPage {

  constructor(private User: UserProvider,
              private app: App,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private util: IonicUtilProvider,
              private analytics: AnalyticsProvider) {
    // Google Analytics
    this.analytics.view('TabAccountSettingsPage');

  }

  onInviteFriends() {
    this.navCtrl.push('PhoneContactPage');
  }

  onFacebookFriends() {
    this.navCtrl.push('FacebookUserListPage')
  }

  aboutPage(): void {
    this.modalCtrl.create('AboutPage').present();
  }

  modalLanguage() {
    this.modalCtrl.create('LanguageModalPage').present();
  }

  href(url): void {
    this.util.href(url);
  }

  public onTerms(): void {
    this.navCtrl.push('TermsPage');
  }

  changePassword(): void {
    this.modalCtrl.create('UserPasswordPage').present();
  }

  editModal(): void {
    this.modalCtrl.create('AccountEditModalPage').present();
  }

  logout(): void {
    this.User.logout();
    this.app.getRootNav().setRoot('IntroPage');
  }

}
