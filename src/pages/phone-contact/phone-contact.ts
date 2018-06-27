import {Component} from "@angular/core";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import _ from "underscore";
import {IonicPage} from "ionic-angular";
import { SMS } from '@ionic-native/sms';

// cordova plugin add https://github.com/dbaq/cordova-plugin-contacts-phone-numbers.git
// cordova plugin add https://github.com/cordova-sms/cordova-sms-plugin.git
declare const navigator: any;
//declare const sms: any;

@IonicPage()
@Component({
  selector   : 'page-phone-contact',
  templateUrl: 'phone-contact.html'
})
export class PhoneContactPage {
  Contacts: any           = navigator.contactsPhoneNumbers;
  //SMS: any                = sms;
  data: any;
  loading: boolean        = false;
  showPermission: boolean = true;
  search: string          = '';
  placeholder: string     = 'Search friend';
  _message: string = 'Hey, come join me on WhatzUp App!, can download it at: http://esocialapp.eu-4.evennode.com/download/';

  cordova: boolean = false;

  constructor(private util: IonicUtilProvider,
      private analytics: AnalyticsProvider,
      private sms: SMS) {
    // Google Analytics
    this.analytics.view('Inviter Page');

    this.cordova = this.util.cordova;
    // Translate Search Bar Placeholder
    this.util.translate(this.placeholder).then((res: string) => this.placeholder = res);

    this.loadContacts();
  }

  loadContacts(val?: string) {
    this.loading        = true;
    this.showPermission = false;
    this.Contacts.list(contacts => {
      let result = contacts;
      let data   = [];
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        result = _.filter(contacts, (item) => (item['firstName'].toLowerCase().indexOf(val.toLowerCase()) > -1))
      }

      let group = _.groupBy(_.sortBy(result, 'firstName'), (contact: any) => contact.firstName ? contact.firstName.substr(0, 1) : '');

      _.each(group, (value, key) => data.push({group: key, list: value}));
      this.data    = data;
      this.loading = false;

    }, this.errorImport)

  }

  errorImport(error) {
    this.loading = false;
    this.util.toast(error);
  }

  // Search
  doSearch() {
    this.loadContacts(this.search);
  }

  doCancel() {
    this.search = '';
    this.doSearch();
  }

  onShare(contact: any, phone: any) {
      //CONFIGURATION
      var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
              //intent: 'INTENT'  // send SMS with the native android SMS messaging
              //intent: '' // send SMS without open any other app
          }
      };

    console.log(contact, phone);
    this.hasPermission().then(permission => {
      if (permission) {
          this.sms.send(phone.normalizeNumber, this._message, options)
              .then(() => {
                  this.util.toast('Invitation sent to ' + phone.normalizeNumber);
              })
      } else {
        this.onErrorSMSPermison();
      }
    })
      .catch(this.onErrorSMSPermison)
  }

  // SMS
  hasPermission(): Promise<any> {
    return new Promise((resolve, reject) => {
        //this.sms.hasPermission(resolve, reject);
        this.sms.hasPermission().then((b) => {
            if (b)
                resolve(b);
            else
                reject(b);
        })
    });
  }

  onErrorSMSPermison() {
    this.util.toast('Please check SMS permission')
  }

}
