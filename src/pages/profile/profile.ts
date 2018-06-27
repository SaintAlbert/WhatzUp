import {Component} from "@angular/core";
import {Events, ModalController, PopoverController, NavParams, IonicPage} from "ionic-angular";
import {UserProvider} from "../../providers/user/user";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {IParams} from "../../models/parse.params.model";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

import Parse from "parse";

@IonicPage()
@Component({
  selector   : 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  user: any;
  username: string;
  loading: boolean  = true;
  type: string      = 'list';
  moreItem: boolean = true;
  eventName: string;
  canEdit: boolean  = false;

  profile: any = {
    id             : '',
    name           : '',
    username       : '',
    photo          : null,
    status         : '',
    galleriesTotal : 0,
    followersTotal : 0,
    followingsTotal: 0,
  };

  params: IParams = {
    limit    : 12,
    page     : 1,
    privacity: 'public',
    username : null
  };

  constructor(private User: UserProvider,
              private events: Events,
              private navParams: NavParams,
              private modalCtrl: ModalController,
              private popoverCtrl: PopoverController,
              private util: IonicUtilProvider,
              private analytics: AnalyticsProvider,) {
    // Google Analytics
    this.analytics.view('ProfilePage');

    this.username        = this.navParams.get('username');
    this.params.username = this.username;
    this.eventName       = this.username;

    let user = Parse.User.current();

    if (this.username == user.get('username')) {
      this.canEdit = true;
    }

    this.loadProfile();
  }


  loadProfile() {
    this.loading         = true;
    this.profile.loading = true;
    this.User.getProfile(this.username).then(profile => {
      this.profile         = profile;
      this.profile.loading = false;
      this.loading         = false;
      this.onSelectType();
    }).catch(this.util.toast);
  }

  openPopover(ev):void {
    this.popoverCtrl.create('ProfilePopoverPage', {username: this.username}).present({ev: ev});
  }

  onEditProfile(): void {
    this.modalCtrl.create('AccountEditModalPage').present();
  }

  onSelectType(type: string = 'list') {
      this.type = type;
      this.params.page = 1;
    setTimeout(() => this.events.publish(this.eventName + ':reload', this.params), 500);
  }

  follow(item): void {
    console.log('user', item);
    item.loading = true;
    this.User.follow({ userId: item.id }).then(resp => {
        this.events.publish('home:reload')
        this.events.publish('search:reload')
      console.log('Follow result', resp);
      item.isFollow = (resp === 'follow') ? true : false;
      if (resp == 'follow') {
          item.followersTotal += 1;
         // this.params.privacity = 'followers';
          //this.events.publish(this.eventName + ':reload', this.params)
      }
      if (resp == 'unfollow') {
          //this.params.privacity = 'public';
         // this.events.publish(this.eventName + ':reload', this.params)
        item.followersTotal -= 1;
      }
      this.events.publish(this.eventName + ':reload')
      
      item.loading = false;
    });
  }

  public doInfinite(event) {
    this.params.page++;
    this.events.unsubscribe(this.eventName + ':complete');
    this.events.subscribe(this.eventName + ':complete', () => event.complete());
    this.sendParams();
  }

  public doRefresh(event?) {
    if (event) {
      event.complete();
    }
    this.params.page = 1;
    this.events.publish(this.eventName + ':reload', this.params);
    this.loadProfile();
  }

  private sendParams(): void {
    console.log('sendParams', this.params);
    this.events.publish(this.eventName + ':params', this.params);
  }

}
