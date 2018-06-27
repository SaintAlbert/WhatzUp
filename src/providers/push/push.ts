import {Injectable} from "@angular/core";
import {OneSignal} from "@ionic-native/onesignal";
import {Platform} from "ionic-angular";

import Parse from "parse";
import {ONE_SIGNAL_GOOGLE_ID, ONE_SIGNAL_ID} from "../../config";
declare const device: any;

@Injectable()
export class PushProvider {

  private cordova: boolean = false;
  private oneSignalId: string;
  private oneSignalToken: string;


  constructor(private platform: Platform,
              private  OneSignal: OneSignal) {
      this.cordova = this.platform.is('cordova') ? true : false;
      if (this.cordova) {
          this.init()
      }
  }

  install(on: boolean = true): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cordova) {
        this.OneSignal.getIds().then(result => {
          let {userId, pushToken} = result;
          if (!on) {
            userId    = '';
            pushToken = ''
          }
          if (result) {
            this.oneSignalId    = userId;
            this.oneSignalToken = pushToken
            Parse.Cloud.run('PushInstall', {device, userId, pushToken}).then(resolve, reject)
          } else {
            resolve('Not push result')
          }
        });
      } else {
        resolve('Not cordova app')
      }
    })
  }

  off(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cordova) {
        this.OneSignal.getIds().then(result => {
          const {userId, pushToken} = result;
          if (result) {
            this.oneSignalId    = userId;
            this.oneSignalToken = pushToken
            Parse.Cloud.run('PushInstall', {device, userId, pushToken}).then(resolve, reject)
          } else {
            resolve('Not push result')
          }
        });
      } else {
        resolve('Not cordova app')
      }
    })
  }


  init() {
    //OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    this.OneSignal
      .startInit(ONE_SIGNAL_ID, ONE_SIGNAL_GOOGLE_ID)
      .inFocusDisplaying(this.OneSignal.OSInFocusDisplayOption.Notification)
      .handleNotificationReceived(jsonData => {
        console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
      })
      .endInit();


    //this.OneSignal.inFocusDisplaying(this.OneSignal.OSInFocusDisplayOption.InAppAlert);

    //this.OneSignal.handleNotificationReceived().subscribe(message => {
    // do something when notification is received
    //console.info('handleNotificationReceived', message)
    //});

    //this.OneSignal.handleNotificationOpened().subscribe(message => {
    // do something when a notification is opened
    //console.info('handleNotificationOpened', message)
    //});

  }
}
