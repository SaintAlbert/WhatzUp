import {Component} from '@angular/core'
import {Events, IonicPage, ViewController} from 'ionic-angular'
import {FormGroup} from '@angular/forms'
import {UserProvider} from '../../../../providers/user/user'
import {IonicUtilProvider} from '../../../../providers/ionic-util/ionic-util'
import {ParseFileProvider} from '../../../../providers/parse-file/parse-file'
import {AnalyticsProvider} from '../../../../providers/analytics/analytics'
import * as _ from 'underscore'

import Parse from 'parse'
import {DynamicFormControlModel, DynamicFormService} from '@ng2-dynamic-forms/core'
import {FORM_EDIT} from '../../form'
import {UserDataProvider} from "../../../../providers/user-data/user-data";

@IonicPage()
@Component({
  selector   : 'page-account-edit-modal',
  templateUrl: 'account-edit-modal.html',
})
export class AccountEditModalPage {

  form: any
  photo: any = './assets/img/user.png'
  _user: any          = Parse.User.current()
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

  formModel: DynamicFormControlModel[] = FORM_EDIT
  formGroup: FormGroup

  constructor(public viewCtrl: ViewController,
              public ionic: IonicUtilProvider,
              public User: UserProvider,
              public formService: DynamicFormService,
              public userData: UserDataProvider,
              public events: Events,
              public util: IonicUtilProvider,
              public ParseFile: ParseFileProvider,
              public analytics: AnalyticsProvider) {

    this._user = Parse.User.current().attributes

    console.log(this._user)

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

    let username = Parse.User.current().get('username')
    this.userData
      .profile(username)
      .then(profile => {
        this._user = profile
        if (profile.photo) {
          this.photo = profile.photo;
        }
        //else {
        //  this.photo = 'assets/img/user.png';
        //}
      });

  }

  ionViewDidLoad() {
    if (this.formGroup.controls) {
      _.each(this._user, (value, key) => {
        if (this.formGroup.controls[key]) {
          this.formGroup.controls[key].setValue(value)
        }
      })
    }
  }

  changePhoto(photo) {
     
      this.util.translate('Uploading image...').then((res: string) => this.util.onLoading(res))
    this.ParseFile.upload({base64: photo})
      .then(this.User.updatePhoto)
      .then(user => {
        this._user = user
        this.photo = photo
        this.util.endLoading()
        this.util.toast('Avatar updated')
      }).catch(error => {
      this.util.toast('Error: Not upload image')
    })
  }

 
  onSubmit(rForm: any) {

    let newForm = this.formGroup.value
    this.analytics.event('Auth', 'update user')

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

    if (!newForm['gender']) {
      return this.util.toast(this.errors['genderRequired'])
    }

    this.ionic.onLoading()
    this
      .User
      .update(newForm)
      .then(result => {
        console.log(result)
        this.ionic.endLoading()
        this.dismiss()
      }).catch(error => {
      console.log(error)
      this.dismiss()
      this.ionic.endLoading()
    })
  }

  dismiss() {
    this.events.publish('profile:reload')
    this.viewCtrl.dismiss()
  }

}
