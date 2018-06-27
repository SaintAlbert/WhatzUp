import {Component, ViewChild, ElementRef, Renderer
    //, trigger, state, style, transition, animate
} from "@angular/core";
import {Events, Content, App, NavController, NavParams, IonicPage, PopoverController, ModalController} from "ionic-angular";
import {IParams} from "../../models/parse.params.model";
import {APP_NAME} from "../../config";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";
import {IonPhotoCropModal} from "../../modules/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
/**
 * Generated class for the TabUpcomingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab-upcoming',
  templateUrl: 'tab-upcoming.html',
  
})
export class TabUpcomingPage {
    @ViewChild(Content) content: Content;
    @ViewChild('inputFile') input: ElementRef;

    appName: string = APP_NAME;
    cordova: boolean = false;
    _eventName: string = '';
    params: IParams = {
        limit: 18,
        page: 1,
        privacity: 'followers',
    };
    eventName: string = 'homeupcoming';
    privacity: string = 'followers';
   
    moreItem: boolean = false;
    isIOS: boolean = false;

    constructor(
        private events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        private app: App,
        private analytics: AnalyticsProvider,
        private util: IonicUtilProvider,
        private popoverCtrl: PopoverController,
        private modalCtrl: ModalController,
        private photoService: IonPhotoService,
        private render: Renderer,
    ) {

        // Google Analytics
        this.analytics.view('TabUpcomingHomePage');
        // this.eventName = 'home';
        //this.eventName2 = 'upcominglist';
        this.cordova = this.util.cordova;
        this.isIOS = this.util.isIOS;
        this.cordova = this.util.cordova;
        this.isIOS = this.util.isIOS;
        this.events.unsubscribe('photoshareupcoming', null);
        this.events.subscribe('photoshareupcoming', _imageCroped => {
            this.util.onLoading();
            setTimeout(() => {
                this.util.endLoading();
            }, 10000)
            let modal = this.modalCtrl.create('PhotoShareEventModalPage', { base64: _imageCroped });
            modal.onDidDismiss(form => {
                if (form) {
                    this.events.publish('uploadupcoming:gallery', form);
                    // this.dismiss()
                }

            });
            modal.present().then(() => {
                this.util.endLoading();
            });

        });

        this.events.subscribe('tabUpcomingHome', () => { 
           // alert("Hello")
            //setTimeout(() => this.onReload(), 500);
            //this.onReload();
            this.events.publish('upcoming-list-edit:reload');
        })
  }

  ionViewDidLoad() {
       //Load Cache
      this.params.page = 1;
      this.events.publish(this.eventName + ':reload', this.params);
    }

  ionViewWillEnter() {
      console.info(this.eventName);
      // More Item
      this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem);
      this.events.subscribe('scroll:up', () => {
          this.scrollTop()
      });

  }

  ionViewDidLeave() {
      //console.warn('ionViewDidLeave home');
      this.events.unsubscribe(this.eventName + ':moreItem');
      this.events.unsubscribe('scroll:up');
  }

  scrollTop() {
      if (this.content._scroll) {
          this.content.scrollToTop(0)
      }
  }

  public doRefresh(event?) {
      if (event) {
          event.complete();
      }
      this.params.page = 1;
      this.events.publish(this.eventName + ':reload', this.params);
  }
  public doInfinite(event) {
      this.params.page++;
      this.events.unsubscribe(this.eventName + ':complete');
      this.events.subscribe(this.eventName + ':complete', () => event.complete());

      this.sendParams();
   
  }
  private sendParams(): void {
      this.events.publish(this.eventName + ':params', this.params);
  }

  openUpcomingCapture() {
      this._eventName = 'photoshareupcoming';
      this.events.publish('sharedNewPost:openCrop');
      //if (this.cordova) {
      //    this.photoService.open()
      //        .then(image => {
      //            this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
      //        })
      //        //.then(image => this.cropImage(image))
      //        .catch(error => this.util.toast(error));
      //    //  this.photoService.onPlayCanvas();
      //} else {
      //    this.events.publish('tabHome')
      //   this.render.invokeElementMethod(this.input.nativeElement, 'click');
      //}
  }


  cropImage(image: any) {
      this.modalCtrl.create(IonPhotoCropModal, { base64: image, eventName: this._eventName }).present();
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

 public onReload(): void {
        this.params.page = 1;
        this.sendParams();
        //this.slider.autoHeight = true
        this.scrollTop();
    }



}
