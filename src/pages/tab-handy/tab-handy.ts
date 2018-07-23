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

@IonicPage()
@Component({
  selector: 'page-tab-handy',
  templateUrl: 'tab-handy.html',
})

export class TabHandyPage {
  @ViewChild(Content) content: Content;

  appName: string = APP_NAME;
  cordova: boolean = false;
  _eventName: string = '';

  eventName: string = 'myhandy';
  privacity: string = 'followers';
  moreItem: boolean = false;
  isIOS: boolean = false;
  chatbadgeIncrease: string = '';
  chatNotify: any;

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  handypage1: any = "Myproject";
  handypage2: any = "HandyBooking";
  handypage3: any = "Message";
  selectedTab = 0;
  mylocation:any=''
  

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
   
  }

  
  ionViewDidLoad() {
     
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

  public onPagecamera(ev) {
    this.events.publish('sharedNewPost:openCrop');
  }

  scrollTop() {
    if (this.content._scroll) {
      this.content.scrollToTop(0)
    }
  }

  //UpdateNotification() {
  //  new Parse.Query(this.chatNotify)
  //    .equalTo('toUser', Parse.User.current())
  //    .equalTo('isRead', false).count().then((tabCount) => {
  //      if (tabCount > 0) {
  //        this.events.publish('chatbadgeIncrease', tabCount)
  //      } else {
  //        this.events.publish('chatbadgeIncrease', '')
  //      }
  //    });
  //}

  



  onTabSelect(tab: { index: number; id: string; }) {
    this.selectedTab = tab.index;
  }
}
