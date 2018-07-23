/// <reference path="../custom/location/location.ts" />
import { Component, ViewChild, ElementRef, Renderer, Renderer2 } from "@angular/core";
import { Events, Content, App, IonicPage, PopoverController, ModalController } from "ionic-angular";
import { IParams } from "../../models/parse.params.model";
import { APP_NAME } from "../../config";
import { AnalyticsProvider } from "../../providers/analytics/analytics";
import { IonicUtilProvider } from "../../providers/ionic-util/ionic-util";
import { IonPhotoService } from "../../modules/ion-photo/ion-photo-service";
import { IonPhotoCropModal } from "../../modules/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import { SuperTabsController, SuperTabs } from 'ionic2-super-tabs';
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";

import Parse from 'parse'

@IonicPage({
  segment: 'feed'
})
@Component({
  selector: 'page-tab-home',
  templateUrl: 'tab-home.html',
})

export class TabHomePage {
  @ViewChild(Content) content: Content;
  @ViewChild('inputFile') input: ElementRef;

  //headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };

  appName: string = APP_NAME;
  cordova: boolean = false;
  _eventName: string = '';
  params: IParams = {
    limit: 18,
    page: 1,
    privacity: 'followers',
  };

  eventName: string = 'home';
  privacity: string = 'followers';
  type: string = 'upcoming';
  moreItem: boolean = false;
  isIOS: boolean = false;
  chatbadgeIncrease: string = '';
  chatNotify: any;

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  page1: any = "TabUpcomingPage";
  page2: any = "TabPhotoPage";
  //page3: any = "TabCategoryPage";
  page3: any = "Home";
  selectedTab = 0;
  mylocation:any=''
  // You can get this data from your API. This is a dumb data for being an example.
  //public stories = [
  //    {
  //        id: 1,
  //        img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
  //        user_name: 'candelibas'
  //    },
  //    {
  //        id: 2,
  //        img: 'https://avatars1.githubusercontent.com/u/918975?v=3&s=120',
  //        user_name: 'maxlynch'
  //    },
  //    {
  //        id: 3,
  //        img: 'http://ionicframework.com/dist/preview-app/www/assets/img/sarah-avatar.png.jpeg',
  //        user_name: 'ashleyosama'
  //    },
  //    {
  //        id: 4,
  //        img: 'https://avatars1.githubusercontent.com/u/1024025?v=3&s=120',
  //        user_name: 'adam_bradley'
  //    },
  //    {
  //        id: 5,
  //        img: 'https://avatars1.githubusercontent.com/u/1024025?v=3&s=120',
  //        user_name: 'linus_torvalds'
  //    }

  //];



  constructor(private events: Events,
    private app: App,
    private analytics: AnalyticsProvider,
    private util: IonicUtilProvider,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private photoService: IonPhotoService,
    private render: Renderer,
    private superTabsCtrl: SuperTabsController,
    private renderer: Renderer2,
    private storage: LocalStorageProvider,
  ) {

    // Google Analytics
    this.analytics.view('TabHomePage');
    this.cordova = this.util.cordova;
    this.isIOS = this.util.isIOS;
    this.chatNotify = Parse.Object.extend('ChatChannelNotify');

    this.events.subscribe('myupcoming', () => {
      this.events.publish('tabUpcomingHome')
      this.slideToIndex(0);
    })
    this.events.subscribe('myhandyman', () => {
        this.events.publish('tabTimelineHome')
        this.slideToIndex(1);
    })
    this.events.subscribe('mytimeline', () => {
      this.events.publish('tabTimelineHome')
      this.slideToIndex(2);
    })
    this.events.subscribe('chatbadgeIncrease', (num) => { this.chatbadgeIncrease = num; })

    this.events.subscribe('OpenphotoService:gallery', (type) => {
      if (type == 'photoshareupcoming') {
        this.openUpcomingCapture();
      } else {
        this.openShareCapture();
      }

    });
  }

  location() {
    let modal = this.modalCtrl.create('Location');
    modal.present();
  }


  ionViewDidLoad() {
      this.storage.get('locale').then((d) => {
          this.mylocation = d;
      });
  }

  ngAfterViewInit() {
    this.superTabsCtrl.enableTabsSwipe(true);

  }

  slideToIndex(index: number) {
    this.superTabsCtrl.slideTo(index)
  }
  hideToolbar() {
    this.superTabs.showToolbar(false);
  }

  public onPageChat() {
    this.app.getRootNav().push('ChatChannelPage');
  }
  public onPageCategory() {
      this.app.getRootNav().push('TabCategoryPage');
  }
  public onPagecamera(ev) {
    this.events.publish('sharedNewPost:openCrop');
  }

  scrollTop() {
    if (this.content._scroll) {
      this.content.scrollToTop(0)
    }
  }


  UpdateNotification() {
    new Parse.Query(this.chatNotify)
      .equalTo('toUser', Parse.User.current())
      .equalTo('isRead', false).count().then((tabCount) => {
        if (tabCount > 0) {
          this.events.publish('chatbadgeIncrease', tabCount)
        } else {
          this.events.publish('chatbadgeIncrease', '')
        }
      });
  }

  openShareCapture() {
    this._eventName = 'photoshare';
    this.openCapture();
  }

  openUpcomingCapture() {
    this._eventName = 'photoshareupcoming';
    this.openCapture();
  }


  openCapture() {
    if (this.cordova) {
      this.photoService.open()
        .then(image => {
          this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
        })
        //.then(image => this.cropImage(image))
        .catch(error => this.util.toast(error));
      //  this.photoService.onPlayCanvas();
    } else {
      this.render.invokeElementMethod(this.input.nativeElement, 'click');
    }
    this.events.publish('tabHome')

  }

  onChange(event) {
    let files = event.srcElement.files;
    let image = files[0];
    let reader = new FileReader();
    if (image) {
      reader.onload = (evt) => {
        if (evt) {
          let image = evt.srcElement['result'];
          //this.cropImage(image)
          this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
        }
      };
      reader.readAsDataURL(image);
    }
  }

  onTabSelect(tab: { index: number; id: string; }) {
    this.selectedTab = tab.index;
    //if (this.selectedTab == 0) {
    //    this.events.publish('tabUpcomingHome')
    //}
    //if (this.selectedTab == 1) {
    //    this.events.publish('tabTimelineHome')
    //}
  }
}
