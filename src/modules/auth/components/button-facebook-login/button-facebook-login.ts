import {Component, EventEmitter, Output} from "@angular/core";
import {Events, LoadingController} from "ionic-angular";
import {IonicUtilProvider} from "../../../../providers/ionic-util/ionic-util";
import {ExternalLibProvider} from "../../../../providers/external-lib/external-lib";
import {AnalyticsProvider} from "../../../../providers/analytics/analytics";
import {UserProvider} from "../../../../providers/user/user";
//import {PushProvider} from "../../../../providers/push/push";
import {ParsePushProvider} from "../../../../providers/parse-push/parse-push";
//import {WhatzUpPushProvider} from "../../../../providers/WhatzUp-push/WhatzUp-push";
import Parse from "parse";

@Component({
    selector: 'button-facebook-login',
    templateUrl: 'button-facebook-login.html'
})
export class ButtonFacebookLoginComponent {

    @Output() onLogin = new EventEmitter()
    @Output() onMerge = new EventEmitter()

    _loading: any;

    constructor(private util: IonicUtilProvider,
        private events: Events,
        private lib: ExternalLibProvider,
        private loadingCtrl: LoadingController,
        private analytics: AnalyticsProvider,
        private provider: UserProvider,
        //private Push: PushProvider,
        //private ParsePush: ParsePushProvider,
        private WhatzUpPush: ParsePushProvider
    ) {
        // Define Facebook Browser and Native
    }


    onFacebookLogin(): void {
        this.analytics.event('Auth', 'Login with Facebook');

        this._loading = this.loadingCtrl.create({ content: 'Login with Facebook' });
        this._loading.present();

        console.log(this.lib.facebook)
        this.lib.facebook.getLoginStatus()
            .then(response => {
                if (response.status === 'connected') {
                    this.processFacebookLogin(response);
                } else {
                    //this.lib.facebook.login(['public_profile,user_friends'])
                    this.lib.facebook.login(['public_profile'])
                        .then((authData) => this.processFacebookLogin(authData))
                        .catch(error => this.onError(error));
                }
            }).catch(error => this.onError(error));
    }

    processFacebookLogin(authData): void {
        this.lib.facebook
            .api('/me?fields=id,name,birthday,last_name,first_name,email,gender', ['public_profile'])
            .then((fbData) => {
                console.log('fbData', fbData);

                let facebookAuthData = {
                    id: authData['authResponse']['userID'],
                    access_token: authData['authResponse']['accessToken'],
                    expiration_date: (new Date().getTime() + 1000).toString()
                };

                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: (user) => {
                        if (!user.existed()) {
                            // New user
                            console.warn('UserProvider signed up and logged in through Facebook!', user);
                            this.provider.facebookSyncProfile(fbData)
                                .then(this.provider.updateWithFacebookData)
                                .then(() => this.onPageAvatar())
                                .catch(error => this.onError(error));
                        } else {
                            // its User
                            console.info('UserProvider logged in through Facebook!', user);
                            this.provider.facebookSyncProfile(fbData)
                                .then(this.provider.updateWithFacebookData)
                                .then(() => this.onPageTabs())
                                .catch(error => this.onError(error));
                        }
                    },
                    error: (user, error) => {
                        console.error('UserProvider cancelled the Facebook login or did not fully authorize.', user, error);
                        this._loading.dismiss();
                        this.util
                            .translate('User cancelled the Facebook login or did not fully authorize')
                            .then(text => this.util.toast(text))

                    }
                });

            });
    }

    onError(error): void {
        if (error) {
            console.log(error)
            this._loading.dismiss();
            this.util.toast(error['message'] || error);
        } else {
            this._loading.dismiss();
        }
    }


    onPageTabs() {
        console.log('Page tabs');
        if (this.provider.validSession()) {

            //this.ParsePush.init();
            //this.Push.install();
            this.WhatzUpPush.initPush();
            this._loading.dismiss();
            this.onLogin.emit(true);
        } else {
            this.onPageAvatar();
        }

    }

    onPageAvatar(): void {
        console.log('Page avatar');
        this._loading.dismiss();
        this.events.publish('auth:register');
        this.onMerge.emit(true);
    }

}
