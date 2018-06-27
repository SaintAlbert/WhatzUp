import { Component, ElementRef, EventEmitter, Output, Renderer, ViewChild } from '@angular/core'
import { Events, ModalController } from 'ionic-angular'
import { IonPhotoService } from '../ion-photo-service'
import { IonicUtilProvider } from '../../../providers/ionic-util/ionic-util'
import { IonPhotoCropModal } from '../ion-photo-crop-modal/ion-photo-crop-modal'

@Component({
    selector: 'image-capture',
    templateUrl: 'image-capture.html',
})
export class ImageCaptureComponent {


    @ViewChild('inputFile') input: ElementRef
    @Output() imageChange: EventEmitter<any> = new EventEmitter()

    cordova: boolean = false
    _eventName: string = 'imagecapture'

    constructor(private photoService: IonPhotoService,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
        private render: Renderer,
        private events: Events) {
        this.cordova = this.util.cordova
        this.events.subscribe(this._eventName, _imageCroped => {

            this.imageChange.emit(_imageCroped);
             //console.log(_imageCroped)
        })
    }

    openCapture() {
        //if (this.cordova) {
        //    this.photoService.open()
        //        .then(image => this.cropImage(image))
        //        .catch(error => this.util.toast(error))
        //} else {
        //    this.render.invokeElementMethod(this.input.nativeElement, 'click')
        //}
        //this.modalCtrl.create('CameraldModalPage', { eventName: this._eventName }).present();
        if (this.cordova) {
            this.photoService.open()
                .then(image => {
                    this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
                })
                //.then(image => this.cropImage(image))
                .catch(error => this.util.toast(error))
        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click')
        }

    }

    cropImage(image: any) {

        return this.modalCtrl.create(IonPhotoCropModal, { base64: this.downscaleImage(image), eventName: this._eventName }).present()
    }

    onChange(event) {
        let files = event.srcElement.files
        let image = files[0]
        let reader = new FileReader()
        if (image) {
            reader.onload = (evt) => {
                if (evt) {
                    console.log(evt)
                    let image = evt.srcElement['result']
                    if (image) {
                        //this.cropImage(image)
                        this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
                    }
                }
            }
            reader.readAsDataURL(image)
        }
    }

    // Take an image URL, downscale it to the given width, and return a new image URL.
    downscaleImage(dataUrl) {
        "use strict";
        var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;

        // Provide default values
        var imageType = "image/jpeg";
        var imageArguments = imageArguments || 0.7;


        // Create a temporary image so that we can compute the height of the downscaled image.
        image = new Image();
        image.src = dataUrl;
        oldWidth = image.width;
        oldHeight = image.height;
        var newWidth = 300;// oldWidth/4;
        newHeight = Math.floor(oldHeight / oldWidth * newWidth)

        // Create a temporary canvas to draw the downscaled image on.
        canvas = document.createElement("canvas");
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the downscaled image on the canvas and return the new data URL.
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, newWidth, newHeight);
        newDataUrl = canvas.toDataURL(imageType, imageArguments);
        return newDataUrl;
    }

}
