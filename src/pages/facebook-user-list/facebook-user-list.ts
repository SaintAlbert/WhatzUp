import {Component} from "@angular/core";
import {IonicPage, NavController} from "ionic-angular";
import {IParams} from "../../models/parse.params.model";
import {UserProvider} from "../../providers/user/user";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {ExternalLibProvider} from "../../providers/external-lib/external-lib";
import _ from "underscore";

@IonicPage()
@Component({
  selector   : 'facebook-user-list',
  templateUrl: 'facebook-user-list.html'
})
export class FacebookUserListPage {

  params: IParams = {
    limit: 5,
    page : 1
  };

  errorIcon: string      = 'ios-person-outline';
  errorText: string      = '';
  loading: boolean       = true;
  showEmptyView: boolean = false;
  showErrorView: boolean = false;
  data                   = [];

  constructor(private provider: UserProvider,
              private navCtrl: NavController,
              private util: IonicUtilProvider,
              private analytics: AnalyticsProvider,
              private lib: ExternalLibProvider,) {

    // Google Analytics
    this.analytics.view('TabAccountSettingsPage');
    setTimeout(() => this.onFacebookLogin(), 1500);
  }


  onFacebookLogin(): void {
    this.analytics.event('Auth', 'Login with Facebook');

    this.util.onLoading();

    console.log(this.lib.facebook)
    this.lib.facebook.getLoginStatus().then(response => {
      if (response.status === 'connected') {
        this.getFacebookFriends(response);
      } else {
          this.lib.facebook.login(['public_profile,user_friends'])
          .then((authData) => this.getFacebookFriends(authData))
          .catch(this.onError);
      }
    }).catch(this.onError);
  }

  onError(error): void {
    this.util.endLoading();
    this.util.toast(error['message'] || error);
  }

  getFacebookFriends(resp) {
   // this.lib.facebook.api('/me/friends').then(resp => {
      this.lib.facebook.api('/me/friends').then(resp => {
          console.log(resp)
          let users = resp.data.map(user => user.id.toString())
          console.log(users)

      this.provider.getFacebookListUsers(users).then(data => {

        this.loading = false;
        if (data.length) {
          this.showErrorView = false;
          this.showEmptyView = false;
          _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
          this.util.endLoading();
        } else {
            this.showEmptyView = true;
            this.util.endLoading();
        }

      })

    }).catch(console.error);
  }

  follow(item): void {
    item.loading = true;
    this.provider.follow({userId: item.id}).then(resp => {
      console.log('Follow result', resp);
      item.isFollow = (resp === 'follow') ? true : false;
      if (resp == 'follow') {
        item.followersTotal += 1;
      }
      if (resp == 'unfollow') {
        item.followersTotal -= 1;
      }
      item.loading = false;
    });
  }

  profile(username: string) {
    return this.navCtrl.push('ProfilePage', {username: username});
  }

  public doTry(): void {
    this.showErrorView = false;
    // this.list();
  }

}
