import {Component} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {DynamicFormControlModel, DynamicFormService} from "@ng2-dynamic-forms/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {IonicUtilProvider} from "../../../../providers/ionic-util/ionic-util";
import {UserProvider} from "../../../../providers/user/user";
import {AnalyticsProvider} from "../../../../providers/analytics/analytics";
import {FORM_REGISTER} from "../../form";

@IonicPage()
@Component({
  selector   : 'page-auth-register',
  templateUrl: 'auth-register.html',
})
export class AuthRegisterPage {

  sucessPage: string
  error: string
  photo: any

  cordova: boolean    = false
  alertTranslate: any = {}
  errors              = {
    nameRequired         : null,
    emailRequired        : null,
    emailInvalid         : null,
    usernameRequired     : null,
    passwordRequired     : null,
    passwordRequiredMin  : null,
    passwordRequiredMatch: null,
    genderRequired       : null,
    relationRequired     : null,
    passwordNotMatch     : null,
  }

  formModel: DynamicFormControlModel[] = FORM_REGISTER
  formGroup: FormGroup

  constructor(private provider: UserProvider,
              private util: IonicUtilProvider,
              private formService: DynamicFormService,
              private analytics: AnalyticsProvider,
              private navParams: NavParams,
              private navCtrl: NavController) {
    // Google Analytics
    this.analytics.view('AuthPage')

    this.sucessPage = this.navParams.get('sucessPage')
    console.log(this.sucessPage)


    // Translate Search Bar Placeholder
    this.util.translate('Enter your email so we can send you a link to reset your password').then((res: string) => this.alertTranslate.message = res)
    this.util.translate('Open your email and also check the spam box').then((res: string) => this.alertTranslate.emailRecoverySend = res)
    this.util.translate('Email is required').then((res: string) => this.alertTranslate.emailRequired = res)
    this.util.translate('Recovery your password').then((res: string) => this.alertTranslate.title = res)
    this.util.translate('Email').then((res: string) => this.alertTranslate.email = res)
    this.util.translate('Cancel').then((res: string) => this.alertTranslate.cancel = res)
    this.util.translate('Submit').then((res: string) => this.alertTranslate.submit = res)

    // Translate Strings
    this.util.translate('Name is required').then((res: string) => this.errors.nameRequired = res)
    this.util.translate('Email is required').then((res: string) => this.errors.emailRequired = res)
    this.util.translate('Email invalid').then((res: string) => this.errors.emailInvalid = res)
    this.util.translate('Username is required').then((res: string) => this.errors.usernameRequired = res)
    this.util.translate('Password is required').then((res: string) => this.errors.passwordRequired = res)
    this.util.translate('Password should be at least 6 characters').then((res: string) => this.errors.passwordRequiredMin = res)
    this.util.translate('passwordNotMatch').then((res: string) => this.errors.passwordNotMatch = res)
    this.util.translate('genderRequired').then((res: string) => this.errors.genderRequired = res)
    this.util.translate('relationRequired').then((res: string) => this.errors.relationRequired = res)
  }

  ionViewWillLoad() {
    this.formGroup = this.formService.createFormGroup(this.formModel)
  }


  onSubmit(): void {
    let newForm = this.formGroup.value
    this.analytics.event('Auth', 'create user')

    if (!newForm['name']) {
      return this.util.toast(this.errors['nameRequired'])
    }

    if (!newForm['email']) {
      return this.util.toast(this.errors['emailRequired'])
    }

    if (!this.util.validEmail(newForm['email'])) {
      return this.util.toast(this.errors['emailInvalid'])
    }

    if (!newForm['username']) {
      return this.util.toast(this.errors['usernameRequired'])
    }

    if (!newForm['password']) {
      return this.util.toast(this.errors['passwordRequired'])
    }

    if (newForm['password'].length < 6) {
      return this.util.toast(this.errors['passwordRequiredMin'])
    }

    if (newForm['password'] !== newForm['passwordConfirmation']) {
      return this.util.toast(this.errors['passwordRequiredMatch'])
    }

    if (!this.util.validPassword(newForm.password, newForm.passwordConfirmation)) {
      return this.util.toast(this.errors['passwordNotMatch'])
    }

    if (!newForm['gender']) {
      return this.util.toast(this.errors['genderRequired'])
    }
    if (!newForm['birthday']) {
        return this.util.toast(this.errors['genderRequired'])
    }
    if (newForm['birthday']) {
        var tempDOB = newForm['birthday'];
        newForm['birthday'] = new Date(tempDOB)
        console.log(newForm)
    }
    //new Date(fbData.birthday)
    this.util.onLoading()

    delete newForm['passwordConfirmation']
    console.log(newForm)
    this.provider
      .signUp(newForm)
      .then(user => {
        if (this.photo) {
          this.util.onLoading('Sending photo avatar')
          this.provider.updateAvatar(this.photo).then(user => {
            this.provider.current = user
            this.util.endLoading()
            this.onPageTabs()
          })
        } else {
          this.util.endLoading()
          this.onPageTabs()
        }
      }).catch(error => {
      this.util.endLoading()
      this.util.toast(error.message)
    })


  }

  onPageTabs() {
      return this.navCtrl.setRoot('TabsPage');
  }

  changePhoto(photo) {
    this.photo = photo
  }

  onTerms() {
    this.navCtrl.push('TermsPage')
  }
}
