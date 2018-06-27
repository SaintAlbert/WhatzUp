import {Component} from '@angular/core';
import {ViewController, NavParams, ModalController, AlertController, Events, IonicPage, App } from 'ionic-angular';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import {GalleryProvider} from "../../providers/gallery/gallery";
import Parse from 'parse'

@IonicPage()
@Component({
    selector: 'photo-list-popover',
    template: `
    <ion-list>
      <button ion-item tappable (click)="report()">{{'Report' | translate}}</button>
      <button *ngIf="canEdit" ion-item tappable (click)="edit()">{{ 'Edit' | translate}}</button>
      <button *ngIf="canEdit" ion-item tappable (click)="destroy()">{{'Destroy ' | translate}}</button>
    </ion-list>
  `
})
export class PhotoListPopoverPage {

    item: any;
    username: string = Parse.User.current().get('username');
    canEdit: boolean = false;
    _translateDestroyTitle: string;
    _translateDestroyMessage: string;
    _translateCancel: string;
    _translateYes: string;

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private ionicUtil: IonicUtilProvider,
        private provider: GalleryProvider,
        private events: Events,
        private modalCtrl: ModalController,
        private util: IonicUtilProvider,
        private app: App,

    ) {
        this.item = this.navParams.get('item');
        console.log(this.item);
        this.canEdit = (this.username == this.item.user.username) ? true : false;
        this.util.translate('Destroy photo').then((res: string) => this._translateDestroyTitle = res);
        this.util.translate('You are sure destroy this photo?').then((res: string) => this._translateDestroyMessage = res);
        this.util.translate('Cancel').then((res: string) => this._translateCancel = res);
        this.util.translate('Yes').then((res: string) => this._translateYes = res);
    }

    report() {
        this.modalCtrl.create('PhotoFeedbackModalPage', { item: this.item, type: 'photo' }).present();
        this.close();
    }

    close() {
        this.events.publish('photoItemClose', null);
        this.viewCtrl.dismiss();
    }

    upload() {
        this.close();
    }

    edit() {
        this.close();
        this.modalCtrl.create('PhotoEditPage', { item: this.item }).present();
    }

    destroy() {
        this.close();
        this.events.unsubscribe('reloadPageHome')
        this.events.subscribe('reloadPageHome', () => {
            if (this.app.getRootNav().canGoBack()) {
                this.app.getRootNav().pop().then(() => {
                    this.events.publish('home:reload', 2);
                    this.events.publish('photolist:reload');
                })
            } else {
                this.events.publish('home:reload', 2);
                this.events.publish('photolist:reload');
            }
        });

        this.alertCtrl.create({
            title: this._translateDestroyTitle,
            message: this._translateDestroyMessage,
            buttons: [
                {
                    text: this._translateCancel,
                    role: 'cancel'
                },
                {
                    text: this._translateYes,
                    handler: () => {
                        this.ionicUtil.onLoading();

                        console.log();
                        this.provider.destroy(this.item.id).then(() => {
                            this.ionicUtil.endLoading();

                            // Event Emit
                            this.events.publish('albumgrid:destroy');
                            //this.events.publish('home:reload', 2);
                            //this.events.publish('photolist:reload', 2);
                            this.events.publish('reloadPageHome');

                        }).catch(error => {
                            console.log(error);
                            //this.util.toast('Error')
                            this.events.publish('reloadPageHome');
                        });
                    }
                }
            ]
        }).present();


        console.log('confirm destroy album');
    }
}
