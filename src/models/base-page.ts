import { Injector } from '@angular/core'
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  PopoverController,
  ToastController,
} from 'ionic-angular'
import { TranslateService } from '@ngx-translate/core'
import { IonicUtilProvider } from '../providers/ionic-util/ionic-util'

export abstract class BasePage {

  public isErrorViewVisible: boolean
  public isEmptyViewVisible: boolean
  public isContentViewVisible: boolean
  public isLoadingViewVisible: boolean

  protected refresher: any
  protected infiniteScroll: any
  protected navParams: NavParams
  protected translate: TranslateService

  private navCtrl: NavController
  private modalCtrl: ModalController
  private toastCtrl: ToastController
  private loadingCtrl: LoadingController
  public alertCtrl: AlertController
  public popoverCtrl: PopoverController
  public util: IonicUtilProvider

  constructor(injector: Injector) {
    this.loadingCtrl = injector.get(LoadingController)
    this.toastCtrl   = injector.get(ToastController)
    this.popoverCtrl = injector.get(PopoverController)
    this.modalCtrl   = injector.get(ModalController)
    this.navCtrl     = injector.get(NavController)
    this.alertCtrl   = injector.get(AlertController)
    this.navParams   = injector.get(NavParams)
    this.translate   = injector.get(TranslateService)
    this.util        = injector.get(IonicUtilProvider)

  }

  showLoadingView() {

    this.isErrorViewVisible   = false
    this.isEmptyViewVisible   = false
    this.isContentViewVisible = false
    this.isLoadingViewVisible = true
  }

  showContentView() {

    this.isErrorViewVisible   = false
    this.isEmptyViewVisible   = false
    this.isLoadingViewVisible = false
    this.isContentViewVisible = true
  }

  showEmptyView() {

    this.isErrorViewVisible   = false
    this.isLoadingViewVisible = false
    this.isContentViewVisible = false
    this.isEmptyViewVisible   = true
  }

  showErrorView() {

    this.isLoadingViewVisible = false
    this.isContentViewVisible = false
    this.isEmptyViewVisible   = false
    this.isErrorViewVisible   = true
  }

  onRefreshComplete(data = null) {

    if (this.refresher) {
      this.refresher.complete()
    }

    if (this.infiniteScroll) {
      this.infiniteScroll.complete()

      if (data && data.length === 0) {
        this.infiniteScroll.enable(false)
      } else {
        this.infiniteScroll.enable(true)
      }
    }
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message:  message,
      duration: 3000,
    }).present()
  }

  showConfirm(message: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

      this.translate.get(['OK', 'CANCEL']).subscribe(values => {

        this.alertCtrl.create({
          title:   '',
          message: message,
          buttons: [
            {
              text:    values.CANCEL,
              handler: () => reject(),
            },
            {
              text:    values.OK,
              handler: () => resolve(true),
            }],
        }).present()

      })
    })
  }

  navigateTo(page: any, params: any = {}) {
    this.navCtrl.push(page, params)
  }

}
