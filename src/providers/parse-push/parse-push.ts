//import {Injectable} from "@angular/core";
//import {Platform, App} from "ionic-angular";

//declare var Parse: any;
//declare var ParsePushPlugin: any;

import {Injectable} from "@angular/core";
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AppVersion } from '@ionic-native/app-version';
import {Platform, AlertController, App} from "ionic-angular";

import Parse from "parse";
import {ONE_SIGNAL_GOOGLE_ID} from "../../config";
declare const device: any;
declare const PushNotification
declare const window: any;
import * as moment from 'moment'

@Injectable()
export class ParsePushProvider {
    private _installationId;
    private current: any;
    private cordova: boolean = false;

    hasPermission: boolean = false;
    pushObject: PushObject;
    private deviceToken: any;

    constructor(private platform: Platform,
        private appVersion: AppVersion, public alertCtrl: AlertController, public push: Push, private app: App) {
        this.cordova = this.platform.is('cordova') ? true : false;
        if (this.cordova) {
            this.push.hasPermission()
                .then((res: any) => {
                    this.hasPermission = res.isEnabled;
                });
        }
    }

    initPush() {
        var user = Parse.User.current();

        if (user != null && this.cordova) {

            // to initialize push notifications
            const options = {
                android: {
                    senderID: ONE_SIGNAL_GOOGLE_ID, "iconColor": "#9900CC"
                },
                ios: {
                    alert: 'true',
                    badge: true,
                    sound: 'false'
                },
                windows: {}
                //browser: {
                //    pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                //}
            };


            const pushObject: PushObject = this.push.init(options);


            //var pushObject = PushNotification.init(options);

            pushObject.on('registration').subscribe((data: any) => {
                return new Promise((resolve, reject) => {
                    if (data.registrationId && this.cordova) {
                        this.deviceToken = data.registrationId
                        var devicType = "";
                        if (this.platform.is('ios')) {
                            devicType = "ios"
                        }
                        if (this.platform.is('android')) {
                            devicType = "android"
                        }
                        var pushData = {

                            'channels': user.get('username'),
                            'deviceToken': this.deviceToken,
                            'deviceType': devicType,
                            'appName': "E-Social",
                            'appIdentifier': "com.saintags.WhatzUpapp",
                            'appVersion': "2.3.6"
                        }

                        Parse.Cloud.run('installPushChannel', pushData).then(resolve, reject)
                    }
                    else {
                        resolve('Not push result')
                    }
                });

            });

            pushObject.on('notification').subscribe((data: any) => {
                console.log(data.message);
                console.log(data.title);
                console.log(data.count);
                console.log(data.sound);
                console.log(data.image);
                console.log(data.additionalData);

                if (data.additionalData.foreground) {
                    // if application open, show popup
                    if (data.additionalData.event == 'chat') {
                        let confirmAlert = this.alertCtrl.create({
                            title: data.title,
                            message: data.message,
                            buttons: [{
                                text: 'View',
                                role: 'cancel'
                            }, {
                                    text: 'View',
                                    handler: () => {
                                        //TODO: Your logic here
                                        //this.nav.push(DetailsPage, { message: data.message });
                                        this.app.getRootNav().push('ChatChannelPage')
                                    }
                                }]
                        });
                        confirmAlert.present();
                    }
                } else {
                    //if user NOT using app and push notification comes
                    //TODO: Your logic on click of push notification directly
                    //this.nav.push(DetailsPage, { message: data.message });
                    console.log('Push notification clicked');
                }

            });
            pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
        }
    }

    //init() {
    //    if (this.cordova && ParsePushPlugin) {
    //        ParsePushPlugin.getInstallationId((id) => {
    //            this._installationId = id;
    //            console.log("device installationId: " + id);
    //            this.subscribeUser().then(user => {
    //                console.log('User subscribe', user);
    //                this.on('chat', function (data:any) {
    //                    this.platform.ready().then(() => {
    //                        if (this.cordova && Parse.User.current()) {
    //                            this.app.getRootNav().push('ChatChannelPage', { channel: data.chat.objectId });
    //                            //this.navCtrl.push('ChatMessagePage', { channel: data.chat.objectId });
    //                            //this.navCtrl.push('ProfilePage', { username: username })
    //                        }
    //                    });
    //                });

    //            });
    //        }, error => console.log);
    //    }
    //}

    //getSubscriptions(): Promise<any> {
    //    return new Promise((resolve, reject) => {
    //        ParsePushPlugin.getSubscriptions((subscriptions) => {
    //            console.log(subscriptions);
    //            resolve(subscriptions);
    //        }, (e) => {
    //            console.log('error', e);
    //            reject(e);
    //        });
    //    })
    //}

    //subscribeUser(): Promise<any> {
    //    return new Promise((resolve, reject) => {

    //        this.current = Parse.User.current();
    //        if (ParsePushPlugin && this.current) {
    //            ParsePushPlugin.subscribe(this.current.get('username'), resolve);
    //        } else {
    //            reject('User Not login');
    //        }
    //    });
    //}

    //on(event: string, callback: any): void {
    //    if (this.cordova && ParsePushPlugin) {
    //        return ParsePushPlugin.on(event, callback);
    //    }
    //}

    //subscribe(channel): Promise<any> {
    //    return new Promise((resolve, reject) => {
    //        if (this.cordova && ParsePushPlugin) {
    //            ParsePushPlugin.subscribe(channel, (resp) => {
    //                console.log('Subcribe in channel', channel);
    //                resolve(resp);
    //            }, (err) => {
    //                console.log('Not Subcribe in channel', channel);
    //                reject(err);
    //            });
    //        }
    //    });
    //}

    //unsubscribe(channel): Promise<any> {
    //    return new Promise((resolve, reject) => {
    //        if (this.cordova && ParsePushPlugin) {
    //            ParsePushPlugin.unsubscribe(channel, (resp) => {
    //                console.log('Unsubcribe in channel', channel);
    //                resolve(resp);
    //            }, (err) => {
    //                console.log('Not Unsubcribe in channel', channel);
    //                reject(err);
    //            });
    //        } else {
    //            reject();
    //        }
    //    });
    //}

   

}
