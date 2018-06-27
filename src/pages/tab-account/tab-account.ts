import {Component} from "@angular/core";
import {App, Events, IonicPage, ModalController, PopoverController} from "ionic-angular";
import {UserDataProvider} from "../../providers/user-data/user-data";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import Parse from "parse";

@IonicPage({
    segment: 'account'
})
@Component({
    selector: 'page-tab-account',
    templateUrl: 'tab-account.html'
})
export class TabAccountPage {
    photo: any = './assets/img/user.png';
    user: any;
    username: string;
    loading: boolean = true;
    type: string = 'list';
    profile: any;
    moreItem: boolean = false;
    eventName: string = 'account';
    isIOS: boolean = true;

    params = {
        limit: 12,
        page: 1,
        privacity: 'public',
        username: ''
    };

    constructor(private userData: UserDataProvider,
        private events: Events,
        private modalCtrl: ModalController,
        private app: App,
        private analytics: AnalyticsProvider,
        private util: IonicUtilProvider,
        private popoverCtrl: PopoverController, ) {
        this.isIOS = this.util.isIOS;
        // Google Analytics
        this.analytics.view('TabAccountPage');

        this.user = Parse.User.current();
        this.username = this.user.get('username');
        this.params.username = this.username;

        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem[0]);
        this.events.subscribe('profile:reload', () => this.loadProfile());

    }

    ionViewDidLoad() {
        this.loadProfile();
        this.onSelectType();
    }

    loadProfile() {
        this.loading = true;
        this.userData.profile(this.username).then(profile => {
            console.log(profile);
            this.profile = profile;
            //this.photo = './assets/img/user.png';
            if (profile.photo) {
              this.photo = profile.photo;
            } 
            //else {
            //  this.photo = './assets/img/user.png';
            //}
            this.loading = false;
        });
    }

    onEditProfile() {

        this.modalCtrl.create('AccountEditModalPage').present();
    }
    onLiveVideo() {
        this.app.getRootNav().push('LiveShowPage');

    }

    onSelectType(type: string = 'list') {
        this.type = type;
        this.params.page = 1;
        setTimeout(() => this.events.publish(this.eventName + ':reload', this.params), 1000);

    }

    onPageSettings() {
        this.app.getRootNav().push('TabAccountSettingsPage');
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.eventName + ':complete');
        this.events.subscribe(this.eventName + ':complete', () => event.complete());
        this.sendParams();
    }

    public doRefresh(event?) {
        event.complete();
        this.params.page = 1;
        this.sendParams();
        this.loadProfile();
    }

    private sendParams(): void {
        this.events.publish(this.eventName + ':params', this.params);
    }

    public onPagecamera(ev) {
        //this.app.getRootNav().push('CameraPopoverPage');
        //let popover = this.popoverCtrl.create('CameraPopoverPage');
        //popover.present({ ev: ev });
        this.events.publish('sharedNewPost:openCrop');
    }
}
