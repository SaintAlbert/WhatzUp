import {Component} from "@angular/core";
import {ViewController, NavParams, ModalController, AlertController, Events, IonicPage} from 'ionic-angular';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import {GalleryAlbumProvider} from '../../providers/gallery-album/gallery-album';

@IonicPage()
@Component({
    selector: 'album-photo-grid-popover',
    template: `
              <ion-list>
                  <button ion-item tappable (click)="upload()">{{_translateUploadTitle}}</button>
                  <button ion-item tappable (click)="edit()">{{_translateEditTitle}}</button>
                  <button ion-item tappable (click)="destroy()">{{_translateDestroyTitle}}</button>
            </ion-list>`
})
export class AlbumPhotoGridPopoverPage {


    cordova: boolean   = false;
    _eventName: string = 'albumUpload';

    id: string;
    _translateEditTitle: string;
    _translateUploadTitle: string;
    _translateDestroyTitle: string;
    _translateDestroyMessage: string;
    _translateCancel: string;
    _translateYes: string;

    constructor(private viewCtrl: ViewController,
                private navParams: NavParams,
                private alertCtrl: AlertController,
                private ionicUtil: IonicUtilProvider,
                private provider: GalleryAlbumProvider,
                private events: Events,
                private modalCtrl: ModalController,
                private util: IonicUtilProvider,
    ) {
        this.id = this.navParams.get('id');
        this.cordova = this.util.cordova;
        console.log(this.id);
        this.util.translate("Upload photo's").then((res: string) => this._translateUploadTitle = res);
        this.util.translate('Edit  name').then((res: string) => this._translateEditTitle = res);
        this.util.translate('Delete album').then((res: string) => this._translateDestroyTitle = res);
        this.util.translate('You are sure, delete this album and photos?').then((res: string) => this._translateDestroyMessage = res);
        this.util.translate('Cancel').then((res: string) => this._translateCancel = res);
        this.util.translate('Yes').then((res: string) => this._translateYes = res);


    }

    close() {
        this.viewCtrl.dismiss();
    }

    upload(){
        this.events.publish('photoGrid:upload');
        this.close();
    }

    edit() {
        this.close();
        this.modalCtrl.create('AlbumFormModalPage', {id: this.id}).present();
    }

    destroy() {
        this.close();

        this.alertCtrl.create({
            title  : this._translateDestroyTitle,
            message: this._translateDestroyMessage,
            buttons: [
                {
                    text: this._translateCancel,
                    role: 'cancel'
                },
                {
                    text   : this._translateYes,
                    handler: () => {
                        this.ionicUtil.onLoading();
                        this.provider.get(this.id).then(gallery => {
                            this.provider.destroy(gallery).then(() => {
                                this.ionicUtil.endLoading();

                                // Event Emit
                                this.events.publish('albumgrid:destroy');
                            });
                        });
                    }
                }
            ]
        }).present();


        console.log('confirm destroy album');
    }
}
