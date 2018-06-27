import {Component} from "@angular/core";
import {IonicPage, ViewController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {languages} from "../../config";
import _ from "underscore";
import Parse from "parse";

@IonicPage()
@Component({
  selector   : 'language-modal',
  templateUrl: 'language-modal.html'
})
export class LanguageModalPage {

  _languages: any;
  _words: string = '';

  constructor(private viewCtrl: ViewController,
              private util: IonicUtilProvider,
              private translate: TranslateService,
              private storage: LocalStorageProvider) {
    this._languages = _.sortBy(languages, 'name');
  }

  doSearch() {
    let filter      = languages.filter(item => item.name.toLowerCase().indexOf(this._words.toLowerCase()) > -1);
    this._languages = _.sortBy(filter, 'name');
  }


  selectLanguage(lang: any) {
    this.util.onLoading();
    let langSelected = lang.code.split('_')[0];
    this.translate.use(langSelected);
    setTimeout(() => {
        this.storage.set('lang', langSelected)
        if (Parse.User.current()) {
            let user = Parse.User.current();
            user.set('lang', langSelected);
            user.save();
        }
      this.util.endLoading();
      this.dismiss();
    }, 1000);
  }

  doCancel(): void {
    this._words = '';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
