import {Component} from "@angular/core";
import {Platform, App, Events} from "ionic-angular";
import {GOOGLE_ANALYTICS, PARSE_APP_ID, PARSE_JAVASCRIPT_KEY, PARSE_SERVER_URL} from "../config";
import {AnalyticsProvider} from "../providers/analytics/analytics";
import {UserProvider} from "../providers/user/user";
import { SocketConectionProvider } from '../providers/socket-conection/socket-conection';
import {ExternalLibProvider} from "../providers/external-lib/external-lib";
import {Device} from "@ionic-native/device";
import {SplashScreen} from "@ionic-native/splash-screen";
//import {PushProvider} from "../providers/push/push";
import {ParsePushProvider} from "../providers/parse-push/parse-push";
//import {WhatzUpPushProvider} from "../providers/whatzup-push/whatzup-push";


//import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import Parse from "parse";
declare var navigator: any;
declare var Connection: any
declare const window: any;
declare const cordova: any;

@Component({
    template: `
    <ion-nav tappable [root]="rootPage" #content></ion-nav>`
})

export class MyApp {
    rootPage: string = 'IntroPage';
    //rootPage: any = 'TabsPage';

    ngOnInit() {
        Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);
        Parse.serverURL = PARSE_SERVER_URL;
    }

    constructor(private platform: Platform,
        private Analytics: AnalyticsProvider,
        private lib: ExternalLibProvider,
        private splashscreen: SplashScreen,
        private whatzuppush: ParsePushProvider,
        private User: UserProvider,
        private app: App,
        private events: Events,
        //private socketConnection: SocketConectionProvider
        ) {

        //Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);
        //Parse.serverURL = PARSE_SERVER_URL;
        this.platform.ready().then(() => {
            //if (!this.User.current()) {
            //    this.rootPage = 'IntroPage';
            //    this.app.getRootNav().setRoot('IntroPage');
            //} else {
            //     this.rootPage = 'TabsPage';
            //    this.app.getRootNav().setRoot('TabsPage');
            //} 
            if (this.User.current()) {
                this.app.getRootNav().setRoot('TabsPage');
            } else {
                this.app.getRootNav().setRoot('IntroPage');
            }
            if (this.platform.is('ios')) {
                cordova.plugins.iosrtc.registerGlobals();
            }

           // splashscreen.hide();
            // Define Facebook Browser and Native
            this.lib.initFacebook();
            if (this.isOnline()) {
                if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
                    this.lib.googleMapsLib();
                }
            }
           
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // StatusBar.styleDefault();
            this.splashscreen.hide();

            // Google Analytics
            this.Analytics.init(GOOGLE_ANALYTICS);
            this.Analytics.appVersion(Device['version']);

            // Start Parse User
            //if (this.User.current()) {
            //   // this.socketConnection.socketInit(this.User.current());
            //     this.rootPage = 'TabsPage';
                //this.app.getRootNav().setRoot('TabsPage').then(() => {
                //    this.app.getRootNav().popToRoot();
                //});
                // return new Promise((resolve, reject) => {


                //});
                if (this.platform.is('cordova')) {
                    //this.Push.install()
                    //this.ParsePush.init();
                    this.whatzuppush.initPush();
                }
            //}
            //else {
            //    this.app.getRootNav().setRoot('IntroPage');
            //}
               // window.addEventListener('orientationchange', this.updatedVideoFrames);
                //window.addEventListener('scroll', this.updatedVideoFrames);
        });

    }
   
    //
    updatedVideoFrames() {
        this.platform.ready().then(() => {
            if (this.platform.is('ios')) {
                cordova.plugins.iosrtc.refreshVideos();
            }
        });
    }

    isOnline(): boolean {
        if (navigator.connection && this.platform.is('cordova')) {
            return navigator.connection.type !== Connection.NONE;
        } else {
            return navigator.onLine;
        }
    }


}
