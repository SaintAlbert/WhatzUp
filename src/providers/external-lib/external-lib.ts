import {Injectable} from "@angular/core";
import {Facebook} from "@ionic-native/facebook";
import {facebook_appId, facebook_appVersion, GOOGLE_MAPS_WEB, language_default, languages} from "../../config";
import {IonicUtilProvider} from "../ionic-util/ionic-util";
import {FacebookService, InitParams} from "ngx-facebook";

declare const FB: any;

@Injectable()
export class ExternalLibProvider {

  facebook: any;
  facebookInitialised: boolean = false;
  cordova: boolean             = false;

  constructor(private util: IonicUtilProvider,
              private Facebook: Facebook,
              private fb: FacebookService) {
    // Define Facebook Browser and Native
    this.cordova = this.util.cordova;
  }

  // Google Maps Browser
  public googleMapsLib() {
    // Create Google Maps in Browser
    //let script = document.createElement('script');
    //script.id  = 'gmaps';
    ////script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit&libraries=data,places,geometry&key=' + GOOGLE_MAPS_WEB;
    //script.src = 'https://maps.googleapis.com/maps/api/js?libraries=data,places,geometry&key=' + GOOGLE_MAPS_WEB;
    //document.body.appendChild(script);
    this.loadScriptAsync('https://maps.googleapis.com/maps/api/js?libraries=data,places,geometry&key=' + GOOGLE_MAPS_WEB, 'gmaps')
  }

   loadScriptAsync(path,id) {
    var jsScript = document.createElement("script");
    jsScript.type = "text/javascript";
    jsScript.id = id;
    jsScript.async = false; //async is being set to false so that script will not immediately fire.
    jsScript.src = path;
    document.getElementsByTagName("body")[0].appendChild(jsScript);
}

  // Facebook Browser
  public facebookLib() {
    let userLang = navigator.language.split('-')[0]; // use navigator lang if available
    userLang     = /(pt|en|de)/gi.test(userLang) ? userLang : language_default.split('_')[0];
    let lang     = languages.filter(item => item.code.toLowerCase().indexOf(userLang.toLowerCase()) > -1);
    // Create Facebook in Browser
    //let script   = document.createElement('script');
    //script.id    = 'facebook';
    //script.src   = 'https://connect.facebook.net/' + lang[0]['code'] + '/sdk.js';
    //document.body.appendChild(script);
    this.loadScriptAsync('https://connect.facebook.net/' + lang[0]['code'] + '/sdk.js', 'facebook')
    let fbParams: InitParams = {
      appId  : facebook_appId,
      xfbml  : true,
      version: facebook_appVersion
    };

   // console.log('script', script);
    setTimeout(() => this.fb.init(fbParams), 1500);
    //setTimeout(() => Parse.FacebookUtils.init(fbParams), 1000);
  }


  initFacebook() {
    this.facebook = this.cordova ? this.Facebook : this.fb;
    if (!this.cordova) {
      this.loadFacebook();
    }
   // this.googleMapsLib();
  }


  loadFacebook(): void {

    this.addConnectivityListeners();
    if (typeof FB == 'undefined') {
      console.log('Facebook JavaScript needs to be loaded.');
      if (this.util.isOnline()) {
        console.log('online, loading facebook');
        this.facebookLib();
      }
    } else {
      if (this.util.isOnline()) {
        console.log('showing facebook');
      } else {
        console.log('disabling facebook');
      }
    }
  }


  addConnectivityListeners(): void {
    let onOnline = () => {
        setTimeout(() => {
           
        if (typeof FB == 'undefined') {
          this.facebookLib();
        } else {
          this.facebookInitialised = true;
            }
       
      }, 2000);

    };

    let onOffline = () => this.facebookInitialised = false;

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }
}
