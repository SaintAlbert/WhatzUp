import {Component} from "@angular/core";
import {IonicPage, NavParams, Events, NavController, PopoverController} from "ionic-angular";
import {GalleryProvider} from "../../providers/gallery/gallery";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

import Parse from "parse";
import _ from "underscore";

@IonicPage()
@Component({
  selector   : 'page-photo',
  templateUrl: 'photo.html'
})
export class PhotoPage {

  item: any;
  id: any;
  loading: boolean = true;
  query: any;
  data = [];
  user: any;
  username: any;
  eventName: string = 'photo';


  constructor(private navParams: NavParams,
              private provider: GalleryProvider,
              private analytics: AnalyticsProvider,
              private navCtrl: NavController,
              private popoverCtrl: PopoverController,
             
              ) {
    // Google Analytics
    this.analytics.view('PhotoPage');
    this.id = this.navParams.get('id');
    this.user = Parse.User.current();
    this.username = this.user.get('username')
    this.loading = true;
    this.load();
   

  }

  load() {
      this.loading = true;
      if (this.navParams.get('item')) {
          this.item = this.navParams.get('item');
          this.loading = false;
      }

    this.provider.get(this.id).then(gallery => {
      console.log('gallery', gallery);
        this.item = gallery;
      this.loading = false;
    });
  }


  ionViewWillEnter() {
      // this.hide = false;
      this.loading = true;
      if (this.navParams.get('item')) {
          this.item = this.navParams.get('item');
          this.loading = false;
      }

  }

  openPopover(ev): void {
      this.popoverCtrl.create('PhotoListPopoverPage', { item: this.item }).present({ ev: ev });
  }

  openProfile(username: string): void {
      this.navCtrl.push('ProfilePage', { username: username })
  }


  //getGalleryComment() {
  //    //this.doRefresh();
  //    this.provider.getParse(this.id).then(gallery => {
        

  //        let ParseObject = Parse.Object.extend('GalleryComment');
  //        this.query = new Parse.Query(ParseObject)
  //            .include(['profile', 'user'])
  //            .descending('createdAt')
  //            .limit(100)
  //            .descending('createdAt')
  //            .equalTo('gallery', gallery);
  //        this.doRefresh();
  //    }).catch(this.onError)

  //}

  //doRefresh() {
  //    this.query.find().then(data => {
  //        if (data) {
  //            this.data = this.parseData(data);

  //        }
  //    }).catch(this.onError)
  //}

  //onError(error) {
  //    console.log(error)
  //}

  //parseData(data: any[]): any[] {
  //    return _.sortBy(data, 'createdAt').map(item => this.parseItem(item));
  //}

  //parseItem(item) {
  //    item.photo = item.get('profile').get('photo') ? item.get('profile').get('photo').url() : 'assets/img/user.png'
  //    item.class = item.get('user').id === this.user.id ? 'right' : 'left';
  //    return item;
  //}



}
