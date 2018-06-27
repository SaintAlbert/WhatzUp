import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from "ionic-angular";
import * as _ from "underscore";

declare var navigator: any;
declare var Connection: any;
declare var cordova: any;

@Injectable()
export class HandyManProvider {
  constructor(private platform: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {


  }
}
