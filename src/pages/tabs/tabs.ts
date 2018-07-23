import {Component, ViewChild, ElementRef, Renderer} from "@angular/core";
import {Tabs,ModalController,Events, IonicPage} from 'ionic-angular';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";
import { handy } from "../../handyman-config";

import Parse from "parse";

@IonicPage({
    segment: 'app'
})
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})

export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    tabHome: any = 'TabHomePage';
    tabSearch: any = 'TabSearchPage';
    //tabCapture: any = 'TabCapturePage';
    //tabChat: any = 'TabChatPage';
    tabActivity: any = 'TabActivityPage';
    tabProfile: any = 'TabAccountPage';
    tabHandy: any ='TabHandyPage';
    //tabMessage: any ='Message';
    drawerOptions: any;
    query: any;
    queryNotify: any;
    _eventName: any = 'sharedNewPost';
    setEventName: any = '';

    tabActivityBadge: number = 0;
    tabChatActivityBadge: number = 0;
    tabMessageBadge: number = 0;
    tabHandyBadge: number = 0;
    chatNotify: any;

    handydata: any = handy;

    @ViewChild('myTabs') tabRef: Tabs;
    @ViewChild('inputFile') input: ElementRef;
    cordova: boolean = false;

    constructor(private events: Events,
        private photoService: IonPhotoService,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
        private render: Renderer,) {
        //this.events.subscribe('tabHome', () => setTimeout(() => this.tabRef.select(0), 100));
        this.cordova = util.cordova;
        this.events.subscribe('tabHome', (d) => {
            if (d == 1) {
                this.events.publish('myupcoming')
            }
            if (d == 2) {
                this.events.publish('mytimeline')
            }
        });
        this.events.subscribe('clearActivity', () => this.tabActivityBadge = 0);
        //this.events.subscribe('ClearChatMessagesRead', () => this.tabChatActivityBadge = 0);


        // Activities for User
        let chatMessage = Parse.Object.extend('GalleryActivity');
        this.query = new Parse.Query(chatMessage)
            .equalTo('toUser', Parse.User.current())
            .equalTo('isRead', false);
        // count activity
        this.query.count().then(
            tabCount => this.tabActivityBadge = tabCount);
        // subscribe activity
        this.query.subscribe().on('create', activity => {
            //this.util.toast(activity.get('fromUser').get('name') + ' ' + activity.get('action'))
            this.tabActivityBadge++
        });

        var chatNotify = Parse.Object.extend('ChatChannelNotify');
        this.queryNotify = new Parse.Query(chatNotify)
            .equalTo('toUser', Parse.User.current())
            .equalTo('isRead', false)
        this.queryNotify.count().then((tabCount) => {
            this.tabChatActivityBadge = tabCount;

            if (tabCount == 0) {
                this.tabChatActivityBadge=0
                this.events.publish('chatbadgeIncrease', '')
            } else {
                this.events.publish('chatbadgeIncrease', this.tabChatActivityBadge)
            }
           
        });
        this.queryNotify.subscribe().on('create', activity => {
            this.tabChatActivityBadge++;
            //this.UpdateNotification();
        });

        this.drawerOptions = {
            handleHeight: 0,
            thresholdFromBottom: 50,
            thresholdFromTop: 200,
            bounceBack: true,
            showTitle: "WhatzUp Share",
            hideTitle: "Close ",
            title: false
        };

    }

    ionViewWillEnter() {
        // subscribe chat
        this.closeDrawer();
        //this.UpdateNotification();
    }

    UpdateNotification() {
        var chatNotify = Parse.Object.extend('ChatChannelNotify');
        this.queryNotify = new Parse.Query(chatNotify)
            .equalTo('toUser', Parse.User.current())
            .equalTo('isRead', false)
        this.queryNotify.count().then((tabCount) => {
           
        });
    }

    OpenCameraShare(sharetype) {
        this.setEventName = sharetype;
        if (this.cordova) {
            this.photoService.openCameraOnly().then((image) => {
                this.modalCtrl.create('NativeCameraModalPage', { eventName: this.setEventName, image: image }).present();
            })
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
        this.closeDrawer();
    }
    OpenGalaryShare(sharetype) {
        this.setEventName = sharetype;
        if (this.cordova) {
            this.photoService.openGalaryOnly().then((image) => {
                this.modalCtrl.create('NativeCameraModalPage', { eventName: this.setEventName, image: image }).present();
            })
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
        this.closeDrawer();
    }

    onChange(event) {
        //console.log(event)
        let files = event.srcElement.files;
        let image = files[0];
        let reader = new FileReader();
        if (image) {
            reader.onload = (evt) => {
                if (evt) {
                    let image = evt.srcElement['result'];
                    this.modalCtrl.create('NativeCameraModalPage', { eventName: this.setEventName, image: image }).present();
                }
            };
            reader.readAsDataURL(image);
        }
    }

    sharePostOnly(sharetype) {
        this.setEventName = sharetype;
        //this.events.publish('tabHome', 2)
        this.events.publish(this.setEventName, null);
        this.closeDrawer();
    }

    openHandyManCreateModal(id) {
        this.modalCtrl.create('HandyManShareModalPage', { eventNumber: id }).present();
        this.closeDrawer();
    }

    closeDrawer() {
        this.events.publish(this._eventName + ':close');
    }

}
