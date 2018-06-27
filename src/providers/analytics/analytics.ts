import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Injectable()
export class AnalyticsProvider {
  cordova: boolean = false;
  initialized: boolean = false;
  constructor(private platform: Platform,
              private ga: GoogleAnalytics) {
    this.cordova = this.platform.is('cordova') ? true : false;
  }

  init(GOOGLE_ID: string) {
      this.platform.ready().then(() => {
          if (this.cordova && !this.initialized) {
               this.ga.startTrackerWithId(GOOGLE_ID)
                  .then(() => {
                          this.initialized = true;
                  });
          }
      })
  }

  view(name: string) {
      this.platform.ready().then(() => {
          if (this.cordova && this.initialized) {
              return this.ga.trackView(name);
          }
      })
  }

  event(category: string,
      action: string) {
      this.platform.ready().then(() => {
          if (this.cordova && this.initialized) {
              return this.ga.trackEvent(category, action);
          }
      })
  }

  appVersion(version: string) {
      this.platform.ready().then(() => {
          if (this.cordova && this.initialized) {
              return this.ga.setAppVersion(version);
          }
      })
  }
}
