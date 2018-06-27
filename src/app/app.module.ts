
import { ErrorHandler, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Http, HttpModule } from '@angular/http';
import { Config, IonicApp, IonicErrorHandler, IonicModule, Platform } from 'ionic-angular'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { DynamicFormsCoreModule } from '@ng2-dynamic-forms/core'
//import { CreditCardDirectivesModule } from 'ng2-cc-library'
// Boostrap Component
import { MyApp } from './app.component'
// Imports
import { Modules, Providers } from './app.imports'
import { SharedLazyModule } from './shared.module'

// Extra
import { language_default, languages } from '../config'
import { LocalStorageProvider } from '../providers/local-storage/local-storage'
import _ from 'underscore'
import moment from 'moment';
import {
    SuperTabsModule
} from 'ionic2-super-tabs';

import { ModalScaleUpEnterTransition } from '../custom/modal/scale-up-enter.transition';
import { ModalScaleUpLeaveTransition } from '../custom/modal/scale-up-leave.transition';

//import { LiveShowComponent } from '../components/live-show/live-show';
//import { LiveShowPageComponent } from '../components/live-show-page/live-show-page';
declare const window: any

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './i18n/', '.json')
}

@NgModule({
    declarations: [
        MyApp,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpModule,
        BrowserAnimationsModule,
        
        //CreditCardDirectivesModule,
        //IonicImageViewerModule,
       // GooglePlaceModule,
        DynamicFormsCoreModule.forRoot(),
       // IonicImageViewerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http],
            },
        }),
        IonicModule.forRoot(MyApp, {
            preloadModules: false,
            mode: 'ios',
        }),
        SuperTabsModule.forRoot(),
       // IonicImageViewerModule,
        //...Modules,
        //SharedLazyModule,
    ],
    exports: [
        ...Modules,
        SharedLazyModule,
    ],
    entryComponents: [
        MyApp,
    ],
    providers: [
        Providers,
        // Native
        { provide: ErrorHandler, useClass: IonicErrorHandler },
   

    ],
    bootstrap: [IonicApp],
})
export class AppModule {

    constructor(private translate: TranslateService,
        private config: Config,
        private platform: Platform,
        private storage: LocalStorageProvider) {
        this.translateConfig()
        this.setCustomTransitions();
        setTimeout(() => {
             this.androidPermission();
        }, 1000)
    }


    translateConfig() {
        // use navigator lang if available
        let userLang = navigator.language.indexOf('-') ? navigator.language.split('-')[0] : navigator.language
        let language = _.find(languages, { code: userLang }) ? _.find(languages, { code: userLang }).code : language_default

        this.translate.addLangs(languages.map(lang => lang.code))

        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang(language_default)

        console.warn(languages, language)

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.storage.get('lang').then(lang => {
            console.info(lang)
            if (lang) {
                this.translate.use(lang)
            } else {
                this.storage.set('lang', language)
                this.translate.use(language)
            }
        })

        // format chat date diffs
        moment.updateLocale('en', {
            relativeTime: {
                future: "in %s",
                past: '%s',
                s: 'now',
                ss: '%d sec',
                m: '1 min',
                mm: "%d min",
                h: "1 hour",
                hh: "%d hrs",
                d: "1 day",
                dd: "%d days",
                M: "1 mth",
                MM: "%d mths",
                y: "a yr",
                yy: "%d yrs"
            }
        });
       // moment.locale(
        //moment.locale('en', {
        //    relativeTime: {
        //        future: 'In %s',
        //        past: '%s',
        //        s: 'now',
        //        m: '1 min',
        //        mm: '%d mins',
        //        h: '1 hr',
        //        hh: '%d hrs',
        //        d: '1 day',
        //        dd: '%d days',
        //        M: '1 mth',
        //        MM: '%d mths',
        //        y: '1 yr',
        //        yy: '%d yrs'
        //    }
        //    //relativeTime: {
        //    //    future: 'In %s',
        //    //    past: '%s',
        //    //    s: 'now',
        //    //    m: '1 m',
        //    //    mm: '%d m',
        //    //    h: '1 h',
        //    //    hh: '%d h',
        //    //    d: '1 d',
        //    //    dd: '%d d',
        //    //    M: '1 m',
        //    //    MM: '%d m',
        //    //    y: '1 y',
        //    //    yy: '%d y'
        //    //},

        //})

        // set lang back button
        this.translate.get('backButtonText').subscribe((res: string) => this.config.set('Back', res));
       // this.config.set('backButtonText', '')


    }

    androidPermission() {
        if (this.platform.is('android') && this.platform.is('cordova')) {

            // IMAGE PICKER PERMISSION
            let imagePicker = window.imagePicker
            if (imagePicker) {
                imagePicker.hasReadPermission((result) => window.imagePicker.requestReadPermission())
            }

            // CAMERA PERMISSION
            let permissions = window.cordova.plugins.permissions

            if (permissions) {
                permissions.requestPermission(permissions.CAMERA, (status) => {
                    if (!status.hasPermission) {
                        console.warn('Camera permission is not turned on')
                    }
                },
                    () => console.warn('Camera permission is not turned on'))
            }

        }
    }

    // set modal transition
    private setCustomTransitions() {
        this.config.setTransition('modal-scale-up-leave', ModalScaleUpLeaveTransition);
        this.config.setTransition('modal-scale-up-enter', ModalScaleUpEnterTransition);
    }

}
