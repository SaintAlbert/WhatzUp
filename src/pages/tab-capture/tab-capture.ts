import {Component, ViewChild, ElementRef, Renderer} from "@angular/core";
import {Events, IonicPage, ModalController} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";
import {IonPhotoCropModal} from "../../modules/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import { CameraPreview, CameraPreviewOptions } from '@ionic-native/camera-preview';

@IonicPage()
@Component({
    selector: 'page-tab-capture',
    templateUrl: 'tab-capture.html'
})
export class TabCapturePage {

    @ViewChild('inputFile') input: ElementRef;
    @ViewChild('fullsize') fullsize: ElementRef;

    cordova: boolean = false;
    _eventName: string = 'photoshare';

    constructor(private photoService: IonPhotoService,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
        private events: Events,
        private render: Renderer,
        private analytics: AnalyticsProvider,
        private cameraPreview: CameraPreview,
    ) {
        // Google Analytics
        this.analytics.view('TabCapturePage');

        this.cordova = this.util.cordova;

        // Open Share Modal
        //this.events.subscribe(this._eventName, _imageCroped => {
        //    let modal = this.modalCtrl.create('PhotoShareModalPage', { base64: _imageCroped });
        //    modal.onDidDismiss(response => {
        //        console.log(response);
        //        if (response) {
        //            this.events.publish('upload:gallery', response);
        //        }
        //    });
        //    modal.present();
        //});

        //this.events.subscribe(this._eventName+"upcoming", _imageCroped => {
        //    let modal = this.modalCtrl.create('PhotoShareEventModalPage', { base64: _imageCroped });
        //    modal.onDidDismiss(form => {
        //        console.log(form);
        //        if (form) {
        //            let modal = this.modalCtrl.create('ShareEventFormModal', { form: form });
        //            modal.onDidDismiss(response => {
        //                console.log(response);
        //                if (response) {
        //                    this.events.publish('uploadupcoming:gallery', response);
        //                }
        //            });
        //            modal.present();
        //            //this.events.publish('uploadupcoming:gallery', response);
        //        }
        //    });
        //    modal.present();
        //});

        //if (!this.cordova) {
        //    setTimeout(() => this.render.invokeElementMethod(this.input.nativeElement, 'click'), 500);
        //}
    }

    //ionViewWillEnter() {
    //    this.events.publish('tabHome')
    //    this.openCapture();
    //}

    //openCapture() {
    //    if (this.cordova) {
    //        //this.photoService.open()
    //        //    .then(image => this.cropImage(image))
    //        //    .catch(error => this.util.toast(error));
    //        this.photoService.onPlayCanvas();
    //    } else {
    //        this.events.publish('tabHome')
    //        this.render.invokeElementMethod(this.input.nativeElement, 'click');
    //    }

    //}

    //cropImage(image: any) {
    //    this.modalCtrl.create(IonPhotoCropModal, { base64: image, eventName: this._eventName }).present();
    //}

    //onChange(event) {
    //    let files = event.srcElement.files;
    //    let image = files[0];
    //    let reader = new FileReader();
    //    if (image) {
    //        reader.onload = (evt) => {
    //            if (evt) {
    //                let image = evt.srcElement['result'];
    //                this.cropImage(image)
    //            }
    //        };
    //        reader.readAsDataURL(image);
    //    }
    //}

    //onCanvasStop(event) {
    //    this.photoService.onStopCanvas()
    //        .then(data => {
    //            const canvas: HTMLCanvasElement = this.fullsize.nativeElement;//window.document.getElementById('fullsize')
    //            var image = canvas.toDataURL('image/jpeg', 1.0);
    //            if (image) {
    //                this.cropImage(image);
    //                this.photoService.onPlayCanvas();
    //            }
    //        })
    //        .catch(error => {
    //            this.util.toast(error)
    //            this.photoService.onPlayCanvas();
    //        });
    //}

    //openGalary() {
    //    this.photoService.openGalaryOnly()
    //        .then(image => this.cropImage(image))
    //        .catch(error => {
    //            this.util.toast(error)
    //            this.photoService.onPlayCanvas();
    //        });
    //}

    //onSwitchGalary() {
    //    this.photoService.onSwitchCanvas()
    //        // .then(image => this.cropImage(image))
    //        .catch(error => {
    //            this.util.toast(error)
    //            this.photoService.onPlayCanvas();
    //        });
    //}

}
