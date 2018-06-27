import { Component } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { DynamicFormControlModel, DynamicFormService } from '@ng2-dynamic-forms/core'
import { AlertController, IonicPage, NavController } from 'ionic-angular'
import { IonicUtilProvider } from '../../../../providers/ionic-util/ionic-util'
import { UserProvider } from '../../../../providers/user/user'
import { AnalyticsProvider } from '../../../../providers/analytics/analytics'
import { FORM_LOGIN } from '../../form'
import {ParsePushProvider} from "../../../../providers/parse-push/parse-push";
//import {WhatzUpPushProvider} from "../../../../providers/WhatzUp-push/WhatzUp-push";

@IonicPage()
@Component({
  selector:    'page-auth-login',
  templateUrl: 'auth-login.html',
})
export class AuthLoginPage {
  error: string

  alertTranslate: any = {}
  cordova: boolean    = false

  formModel: DynamicFormControlModel[] = FORM_LOGIN
  formGroup: FormGroup
  errors              = {
    nameRequired:          null,
    emailRequired:         null,
    emailInvalid:          null,
    usernameRequired:      null,
    passwordRequired:      null,
    passwordRequiredMin:   null,
    passwordRequiredMatch: null,
    genderRequired:        null,
    relationRequired:      null,
    passwordNotMatch:      null,
  }

  constructor(private provider: UserProvider,
              private alertCtrl: AlertController,
              private util: IonicUtilProvider,
              private formService: DynamicFormService,
              private navCtrl: NavController,
              private analytics: AnalyticsProvider,
              private WhatzUpPush: ParsePushProvider
  ) {
    // Google Analytics
    this.analytics.view('AuthPage')


    // Translate Search Bar Placeholder
    this.util.translate('Username is required').then((res: string) => this.errors.usernameRequired = res)
    this.util.translate('Password is required').then((res: string) => this.errors.passwordRequired = res)

    this.util.translate('Forgot Password ?').then((res: string) => this.alertTranslate.title = res)
    this.util.translate('Enter your email to reset password').then((res: string) => this.alertTranslate.message = res)
    this.util.translate('Email address').then((res: string) => this.alertTranslate.email = res)
    this.util.translate('Cancel').then((res: string) => this.alertTranslate.cancel = res)
    this.util.translate('Submit').then((res: string) => this.alertTranslate.submit = res)
      
  }


  ionViewWillLoad() {
    this.formGroup = this.formService.createFormGroup(this.formModel)
  }


  onSubmit(form): void {
    let newForm = this.formGroup.value
    this.analytics.event('Auth', 'auth user')

    if (!newForm['username']) {
      return this.util.toast(this.errors['usernameRequired'])
    }

    if (!newForm['password']) {
      return this.util.toast(this.errors['passwordRequired'])
    }

    this.util.onLoading()

    this
      .provider
      .signIn(newForm)
      .then(user => {
          console.log('auth', user)
         this.WhatzUpPush.initPush();
      this.util.endLoading()
      this.onPageTabs()
    }).catch(error => {
      console.log(error)
      this.util.endLoading()
      this.util.toast(error.message)
    })
  }


  onPageTabs() {
     
    return this.navCtrl.setRoot('TabsPage');
  }


  resetPassword(): void {
    this.analytics.event('Auth', 'reset password')
    this.alertCtrl.create({
      title:   this.alertTranslate.title,
      message: this.alertTranslate.message,
      inputs:  [
        {
          placeholder: this.alertTranslate.email,
          name:        'email',
          type: 'email',
       
        },
      ],
      buttons: [
        {
          text: this.alertTranslate.cancel,
          role: 'cancel',
          cssClass: 'primary',
        },
        {
            text: this.alertTranslate.submit,
            cssClass: 'primary',
          handler: data => {
            if (data.email) {
              this.util.onLoading()
              this.provider.recoverPassword(data.email).then(result => {
                console.log(result)
                setTimeout(() => {
                  this.util.endLoading()
                  this.util.toast(this.alertTranslate.emailRecoverySend)
                }, 500)
                return false
              }).catch(error => {
                this.util.toast('Server error')
                this.util.endLoading()
              })
            } else {
              this.util.toast(this.alertTranslate.emailRequired)
            }
          },
        },
      ],
    }).present()
  }

}
