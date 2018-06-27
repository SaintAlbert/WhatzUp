import {Component} from '@angular/core';
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {ViewController, NavParams, IonicPage} from "ionic-angular";
import {GallerFeedbackProvider} from "../../providers/gallery-feedback/gallery-feedback";
import {UpcomingFeedbackProvider} from "../../providers/upcoming-feedback/upcoming-feedback";
import {UserProvider} from "../../providers/user/user";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
    selector   : 'photo-feedback-modal',
    templateUrl: 'photo-feedback-modal.html'
})
export class PhotoFeedbackModalPage{

    photo: any;
    submitted: boolean = false;
    form: any          = {
        title  : '',
        subject: '',
        message: '',
        lang: '',
        type:'',
    };

    constructor(private ionic: IonicUtilProvider,
                private viewCtrl: ViewController,
                private navParams: NavParams,
                private provider: GallerFeedbackProvider,
                private providerUpcoming: UpcomingFeedbackProvider,
                private User: UserProvider,
                private translate: TranslateService,
                private analytics: AnalyticsProvider,
    ) {
        // Google Analytics
        this.analytics.view('PhotoFeedbackModalPage');

       
        this.form.user    = this.User.current();
        this.form.lang = this.translate.getDefaultLang();
        this.form.type = this.navParams.get('type');
        if (this.form.type == 'upcoming') {
            this.form.upcoming = this.navParams.get('item').obj;
        } else {
            this.form.gallery = this.navParams.get('item').obj;
        }
        
        console.log(this.form);
    }

    onSubmit(rForm: any) {
        this.submitted = true;
        if (rForm.valid) {
            this.ionic.onLoading();
            if (this.form.type == 'photo') {
                this.provider.create(this.form).then(result => {
                    console.log(result);
                    this.ionic.endLoading();
                    this.dismiss();
                }, error => {
                    console.log(error);
                    this.ionic.endLoading();
                    this.dismiss();
                })
            }
            if (this.form.type == 'upcoming') {
                this.providerUpcoming.create(this.form).then(result => {
                    console.log(result);
                    this.ionic.endLoading();
                    this.dismiss();
                }, error => {
                    console.log(error);
                    this.ionic.endLoading();
                    this.dismiss();
                })
            }
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}
