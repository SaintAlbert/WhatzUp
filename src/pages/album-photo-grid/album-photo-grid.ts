import {Component, ElementRef, Renderer, ViewChild} from "@angular/core";
import {
    Events,
    IonicPage,
    ModalController,
    NavController,
    NavParams,
    PopoverController,
    ViewController
} from "ionic-angular";
import {GalleryAlbumProvider} from "../../providers/gallery-album/gallery-album";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";

import _ from "underscore";

import Parse from "parse";
import {IonPhotoCropModal} from "../../modules/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";
//import {ModalPost} from "../modal-post/modal-post";


@IonicPage()
@Component({
    selector: 'album-photo-grid',
    templateUrl: 'album-photo-grid.html'
})
export class AlbumPhotoGridPage {

    @ViewChild('inputFile') input: ElementRef;

    params = {
        limit: 15,
        page: 1,
        id: null
    };

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean = false;
    canEdit: boolean = false;
    username: any;
    album: any;

    _eventName: string = 'albumUpload';
    cordova: boolean = false;

    constructor(private provider: GalleryAlbumProvider,
        private events: Events,
        private navCtrl: NavController,
        private viewCtrl: ViewController,
        private navParams: NavParams,
        private popoverCtrl: PopoverController,
        private modalCtrl: ModalController,
        private photoService: IonPhotoService,
        private render: Renderer,
        private util: IonicUtilProvider) {
        this.username = Parse.User.current().get('username');
        this.cordova = this.util.cordova;

        // Open Share Modal
        this.events.unsubscribe(this._eventName)
        this.events.unsubscribe('home:reload')
        this.events.unsubscribe('photoGrid:upload')
        this.events.subscribe(this._eventName, _imageCroped => {
            console.log(this.album);
            let modal = this.modalCtrl.create('PhotoShareModalPage', { base64: _imageCroped, album: this.album });
            modal.onDidDismiss(response => {
                console.log(response);
                if (response) {
                    this.loading = true;
                    this.events.publish('upload:gallery', response);
                }
            });
            modal.present();
        });

        this.events.subscribe('home:reload', () => this.doRefresh());
        this.events.subscribe('photoGrid:upload', () => this.upload());
        this.events.subscribe('albumgrid:reload', () => this.feed());
        this.events.subscribe('albumgrid:destroy', () => this.dismiss());

        this.params.id = this.navParams.get('id');

        //this.events.subscribe('albumgrid:reload', () => this.feed());
        //this.events.subscribe('albumgrid:destroy', () => this.dismiss());
        this.provider.get(this.params.id).then(album => {
            console.log('album', album);
            this.album = album;
            this.canEdit = this.validCanEdit(album['user'].get('username'));
            this.feed();
        })
    }

    //ionViewWillEnter() {
    //  console.log(this.navParams.get('id'));
    //  this.params.id = this.navParams.get('id');

    //  //this.events.subscribe('albumgrid:reload', () => this.feed());
    //  //this.events.subscribe('albumgrid:destroy', () => this.dismiss());
    //  this.provider.get(this.params.id).then(album => {
    //    console.log('album', album);
    //    this.album   = album;
    //    this.canEdit = this.validCanEdit(album['user'].get('username'));
    //    this.feed();
    //  })
    //}

    upload() {
        if (this.cordova) {
            this.photoService.open()
                .then(image => this.cropImage(image))
                .catch(error => this.util.toast(error));
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }

    }

    cropImage(image: any) {
        this.modalCtrl.create(IonPhotoCropModal, { base64: image, eventName: this._eventName }).present();
    }

    onChange(event) {
        let files = event.srcElement.files;
        let image = files[0];
        let reader = new FileReader();
        if (image) {
            reader.onload = (evt) => {
                if (evt) {
                    let image = evt.srcElement['result'];
                    this.cropImage(image)
                }
            };
            reader.readAsDataURL(image);
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    openPhoto(item): void {
      
        let modal = this.modalCtrl.create("ModalPost",
            { // Send data to modal
                id: item.id, item: item 
            }, // This data comes from API!
            { showBackdrop: true, enableBackdropDismiss: true });
        modal.present();
    }

    popover(event): void {
        this.popoverCtrl.create('AlbumPhotoGridPopoverPage', { id: this.params.id }).present({ ev: event });
    }

    feed(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.params.page == 1) {
                this.data = [];
                this.loading = true;
            }

            this.provider.getAlbum(this.params).then(data => {

                console.log(data)
                if (data) {
                    this.showErrorView = false;
                    this.showEmptyView = false;

                    _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
                    this.moreItem = true;

                }
                //else {
                //    this.moreItem = false;
                //}

                if (!this.data.length) {
                    this.showEmptyView = true;
                    this.moreItem = false;
                }
                this.loading = false;
                resolve(data);
            }).catch(error => {
                this.errorText = error.message;
                this.showErrorView = true;
                this.loading = false;
                reject(error);
            });
        });
    }

    validCanEdit(username): boolean {
        return (this.username == username) ? true : false;
    }

    public doInfinite(event) {
        console.log(event)
        if (event) {
            event.complete();
        }
        this.params.page++;
        this.feed();
    }

    public doRefresh(event?) {
        if (event) {
            event.complete();
        }
        this.params.page = 1;
        this.feed();
    }

}
