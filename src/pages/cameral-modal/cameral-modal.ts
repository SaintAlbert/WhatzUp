/// <reference path="../../pipes/cdvphotolibrary.pipe.ts" />
import {Component, ViewChild, ElementRef, Renderer} from "@angular/core";
import {Events, IonicPage, ModalController, NavParams, Platform, ViewController} from "ionic-angular";
//import {Gesture} from 'ionic-angular/gestures/gesture';

import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";
import {IonPhotoCanvasService} from "../../modules/ion-photo/ion-photo-canvas-service";
import {IonPhotoCropModal} from "../../modules/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import {CameraUtils} from '../../providers/camera-util/camera-utils';
import _ from "underscore";
//import rtcCustom  from 'rtc-everywhere';

//import * as rtc from "rtc-everywhere";
//import rtc = require("rtc-everywhere");
//import {CDVPhotoLibraryPipe} from '../../pipes/cdvphotolibrary.pipe'

//import { Flashlight } from '@ionic-native/flashlight';


interface MyResult {
    r: any;
    g: any;
    b: any;
    c: any;
    n: any
}

declare const window: any;
declare var navigator: any
declare var MediaStream: any
declare var ImageCapture: any

//declare var rtcCustom: any


@IonicPage()
@Component({
    selector: 'cameral-modal',
    templateUrl: 'cameral-modal.html'
})

export class CameraldModalPage {
    @ViewChild('inputFile') input: ElementRef;
    @ViewChild('fullsize') fullsize: ElementRef;
    @ViewChild('snapView') snapView: ElementRef;
    @ViewChild('publisher') publisher: ElementRef;
    @ViewChild('cameradisplay') cameradisplay: ElementRef;
    @ViewChild('fullsizeVideo') fullsizeVideo: ElementRef;

    // getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.mediaDevices.getUserMedia );

    flash: boolean = false;
    position: boolean
    cordova: boolean = false;
    _eventName: string;
    image: any;
    Originalimage: any;
    //positionDirection: String = 'environment'//'user'
    front = false;
    imageCapture: any
    video_: any
    adjustScale = 0;
    currentScale = 0;
    ShowFlash = false

    CameraCapabilities: any;
    CameraSettings: any;
    drawerOptions: any;
    selectedPhoto = new Array()
    //camerapipe: CDVPhotoLibraryPipe
    mediaStream: any
    cameradisplayClass: string = 'hidemyContainer';
    publisherClass: string = 'showMyElement';
    showControl: string = 'showMyElement';
    hideControl: string = 'hidemyContainer';
    showHideFlashControl: string = 'showMyElement';
    showHideFilterControl: string = 'hidemyContainer';
    showHideGalaryControl: string = 'hidemyContainer';
    filters = new Array();
    galaryObject: any;
    gesture: any


    constructor(private viewCtrl: ViewController,
        private photoService: IonPhotoService,
        private ionPhotoCanvasService: IonPhotoCanvasService,
        private cameraUtils: CameraUtils,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
        private events: Events,
        private render: Renderer,
        private analytics: AnalyticsProvider,
        private navParams: NavParams,
        //private gesture: any,
        private platform: Platform,
        // private flashlight: Flashlight,

    ) {
        // Google Analytics
        this.analytics.view('TabCapturePage');
        //this._eventName = "galarydrawer"
       
        this.cordova = this.util.cordova;
        if (this.cordova) {
            this.cameraUtils.boot().then(v => {
                this.cameraUtils.canvas = this.fullsize.nativeElement;
                this.cameraUtils.video = this.fullsizeVideo.nativeElement;
                this.cameraUtils.start()
                console.log(v)
                this.openCapture();
            })
        }

        this._eventName = this.navParams.get('eventName');

        this.events.unsubscribe('photoshareupcoming', null);
        this.events.unsubscribe('photoshare', null);

        //this.events.unsubscribe(this._eventName, null);
        if (this._eventName == 'photoshareupcoming' || this._eventName == 'photoshare') {
            this.events.subscribe('photoshare', _imageCroped => {
                let modal = this.modalCtrl.create('PhotoShareModalPage', { base64: _imageCroped });
                modal.onDidDismiss(response => {
                    console.log(response);
                    if (response) {
                        this.events.publish('upload:gallery', response);
                        this.dismiss()
                    }
                });
                modal.present();
            });

            this.events.subscribe('photoshareupcoming', _imageCroped => {
                let modal = this.modalCtrl.create('PhotoShareEventModalPage', { base64: _imageCroped });
                modal.onDidDismiss(form => {

                    if (form) {
                        this.events.publish('uploadupcoming:gallery', form);
                        this.dismiss()
                    }

                });
                modal.present();
            });
        }

        if (!this.cordova) {
            setTimeout(() => this.render.invokeElementMethod(this.input.nativeElement, 'click'), 500);
        }
        this.initColorFilter();
        this.drawerOptions = {
            handleHeight: 0,
            thresholdFromBottom: 50,
            thresholdFromTop: 200,
            bounceBack: true,
            showTitle: " Photo Library",
            hideTitle: "Close Library",
            title: false
        };
    }

   

    ionViewWillEnter() {
        //this.cameraUtils.canvas = this.fullsize.nativeElement;
        //this.cameraUtils.video = this.fullsizeVideo.nativeElement;
        //if (this.cordova) {
        //    //this.cameraUtils.start().then(v => {
        //    //    console.log(v)
        //    //})
        //    //this.cameraUtils.boot();
        //    //this.openCapture();
        //    this.publisherClass = 'hidemyContainer';
        //}
        this._eventName = this.navParams.get('eventName');
        this.events.publish('tabHome')
    }

    ionViewDidEnter() {
        if (this.cordova) {
            this.ionPhotoCanvasService.getOutput().subscribe((val) => {
                this.galaryObject = val;
            });
        }
    }

    ionViewDidLeave() {
        this.stopVideo()
    }

    openCapture() {
        this.publisherClass = 'hidemyContainer';
        if (this.cordova) {
            this.video_ = this.fullsizeVideo.nativeElement;
            this.video_.onloadedmetadata = () => {
                this.cameradisplayClass = 'showMyElement';
                this.showHideFilterControl = 'hidemyContainer';
                this.showHideGalaryControl = 'hidemyContainer';
                this.publisherClass = 'hidemyContainer';
                this.showControl = 'showMyElement';
                this.hideControl = 'hidemyContainer';
                this.events.publish(this._eventName + ':close');
                this.gesture = new window['Hammer'](this.video_);
                this.gesture.get('pinch').set({ enable: true });
                //console.log("Got here")
            };

            //this.initUserMediaCamera();
        } else {
            //this.events.publish('tabHome')
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
    }

    cropImage(image: any) {
        this.modalCtrl.create(IonPhotoCropModal, { base64: image, eventName: this._eventName }).present();
        this.dismiss()
    }

    onChange(event) {
        let files = event.srcElement.files;
        let image = files[0];
        let reader = new FileReader();
        if (image) {
            reader.onload = (evt) => {
                if (evt) {
                    let image = evt.srcElement['result'];
                    this.image = image;
                    this.updateCanvasImage();
                }
            };
            reader.readAsDataURL(image);
        }
    }

    CaptureUserMedia() {
        const canvas: HTMLCanvasElement = this.fullsize.nativeElement;
        const video: HTMLVideoElement = this.fullsizeVideo.nativeElement;
        //this.drawCanvas(canvas, video, video.videoWidth, video.videoHeight);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let ratio = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
        let x = (canvas.width - video.videoWidth * ratio) / 2;
        let y = (canvas.height - video.videoHeight * ratio) / 2;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
            x, y, video.videoWidth * ratio, video.videoHeight * ratio);
        //canvas.getContext('2d').
        //    drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = new Image()
        image.onload = () => {
            this.image = image.src;
            this.Originalimage = image.src;
        }
        image.src = canvas.toDataURL('image/jpeg', 1.0);
        //this.mediaStream.applyConstraints({
        //    advanced: [{ torch: false }]
        //}).catch(e => console.log(e));
        this.stopCanvasVideo()

    }

    initUserMediaCamera() {
        this.stopVideo();
        this.video_ = this.fullsizeVideo.nativeElement;
        var fmode = (this.front ? "user" : "environment");

        var constraints = {
            //facingMode: this.positionDirection, //'environment'
            //facingMode: fmode,//(this.front ? "user" : "environment"),
            'audio': false,
            'video': {
                //deviceId: null,
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 776, ideal: 720, max: 1080 },
                facingMode: fmode,
            }
        };
        console.log(constraints)
        // get the available video input devices and choose the one that represents the backside camera
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.enumerateDevices()
                /* replacement for not working "facingMode: 'environment'": use filter to get the backside camera with the flash light */
                // .then(mediaDeviceInfos => mediaDeviceInfos.filter(mediaDeviceInfo => ((mediaDeviceInfo.kind === 'videoinput')/* && mediaDeviceInfo.label.includes("back")*/)))
                .then(mediaDeviceInfos => {
                    // get the device ID of the backside camera and use it for media stream initialization
                    //constraints.video.deviceId = mediaDeviceInfos[0].deviceId;
                    console.log(mediaDeviceInfos)
                    navigator.mediaDevices.getUserMedia(constraints)
                        .then((getmedia) => {
                            console.log("I got to media area3")
                            if (getmedia.getVideoTracks().length) {
                                const track = getmedia.getVideoTracks()[0];
                                this.handleSuccess(new MediaStream([track]))
                                this.mediaStream = track
                                window.setTimeout(() => (
                                    this.onCapabilitiesReady()
                                ), 500);
                            }
                        }).catch(this.handleVideoError);
                })
        }
    }
    onCapabilitiesReady() {
        //this.front 
        var capabilities = this.mediaStream.getCapabilities()
        if (capabilities.torch && !this.front) {
            this.ShowFlash = true;
        }
        else {
            this.ShowFlash = false;
        }
        if (capabilities.zoom) {
            var zoomMax = capabilities.zoom.max
            this.adjustScale = capabilities.zoom.min;
            this.currentScale = capabilities.zoom.min
            this.gesture.on('doubletap', (ev) => {
                if (this.adjustScale != zoomMax) {
                    this.adjustScale += 100;
                    //
                    this.mediaStream.applyConstraints({ advanced: [{ zoom: this.adjustScale }] })
                        .catch(error => console.error('Uh, oh, applyConstraints() error:', error));
                }
                else {
                    this.adjustScale = 100;
                    this.mediaStream.applyConstraints({ advanced: [{ zoom: this.adjustScale }] })
                        .catch(error => console.error('Uh, oh, applyConstraints() error:', error));
                }
            });

            this.gesture.on("pinch", (ev) => {
                // Adjusting the current pinch/pan event properties using the previous ones set when they finished touching
                if ((this.adjustScale * ev.scale) != zoomMax) {
                    this.currentScale = this.adjustScale * ev.scale;
                    //this.currentScale = zoomMax;
                }
                else {
                    this.currentScale = capabilities.zoom.min;
                }
            })
            this.gesture.on("pinchend", (ev) => {
                // Saving the final transforms for adjustment next time the user interacts.
                this.adjustScale = this.currentScale;
                this.mediaStream.applyConstraints({ advanced: [{ zoom: this.adjustScale }] })
                    .catch(error => console.error('Uh, oh, applyConstraints() error:', error));
                this.currentScale = 100;
            });
            this.gesture.on("panend", (ev) => {
                // Saving the final transforms for adjustment next time the user interacts.
                this.adjustScale = this.currentScale;
                this.mediaStream.applyConstraints({ advanced: [{ zoom: this.adjustScale }] })
                    .catch(error => console.error('Uh, oh, applyConstraints() error:', error));
            });
        }

        console.log(this.mediaStream.getCapabilities());
        console.log(this.mediaStream.getSettings());
    }
    handleSuccess(stream) {
        // make stream available to browser console
        this.mediaStream = stream;
        this.video_.srcObject = stream;
        this.video_.onloadedmetadata = () => {
            this.cameradisplayClass = 'showMyElement';
            this.showHideFilterControl = 'hidemyContainer';
            this.showHideGalaryControl = 'hidemyContainer';
            this.publisherClass = 'hidemyContainer';
            this.showControl = 'showMyElement';
            this.hideControl = 'hidemyContainer';
            this.events.publish(this._eventName + ':close');
            this.gesture = new window['Hammer'](this.video_);
            this.gesture.get('pinch').set({ enable: true });
            //console.log("Got here")
        };
    }
    handleVideoError(error) {
        console.log('navigator.getUserMedia error: ', error);
    }

    drawCanvas(canvas, img, width, height) {
        canvas.width = width;
        canvas.height = height;
        let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
        let x = (canvas.width - img.width * ratio) / 2;
        let y = (canvas.height - img.height * ratio) / 2;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
            x, y, img.width * ratio, img.height * ratio);

        this.stopCanvasVideo()

        var image = new Image()
        image.onload = () => {
            this.image = image.src;
            this.Originalimage = image.src;
        }
        image.src = canvas.toDataURL('image/jpeg', 1.0);
    }

    SwithCameraButton() {
        //this.positionDirection = (this.positionDirection === 'user') ? 'environment' : 'user';
        //this.positionDirection = this.positionDirection ? 'environment' : 'user';
        //this.front = !this.front// ? false : true
        //this.flash = this.flash ? true : false;
        //this.initUserMediaCamera();
        this.cameraUtils.switch();
    }


    stopVideo() {
        this.cameraUtils.stop();
    }

    onCanvasStop() {
        this.CaptureUserMedia();
    }

    useGalaryPhoto(event) {
        //let imgUrl: string = (event.target as HTMLImageElement).src;
        //import { normalizeURL} from ‘ionic - angular’;

        //store your image path in some new variable.
        //var imagePath = this.file.dataDirectory + “test.png”;
        //this.tempImagePath = normalizeURL(imagePath);

        //then in your html file,
        //    use tempImagePath as image src.
        this.selectedPhoto.push(event)
        let reader = new FileReader();
        this.ionPhotoCanvasService.getLaberyImage(event)
            .then((datablob: any) => {
                reader.onload = (evt) => {
                    let dataUrl = reader.result;
                    const image: HTMLImageElement = this.snapView.nativeElement;
                    image.setAttribute('src', dataUrl);
                    this.cameradisplayClass = 'hidemyContainer';
                    this.publisherClass = 'showMyElement';
                    this.events.publish(this._eventName + ':close');
                    this.image = dataUrl;
                    //this.updateCanvasImage();
                }
                reader.readAsDataURL(datablob);
            });

    }

    isInArray(id: any): boolean {
        let check: boolean = false;
        for (let Id of this.selectedPhoto) {
            if (Id == id) {
                check = true;
            }
        }
        return check;
    }

    openGalary() {
        //this.events.publish(this._eventName + ':open');
        if (this.cordova) {
            this.showHideGalaryControl = (this.showHideGalaryControl === 'showMyElement') ? 'hidemyContainer' : 'showMyElement';
            this.events.publish(this._eventName + ':open');

        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
    }

    dismissPublish() {
        this.events.publish(this._eventName + ':close');
        if (!this.cordova) {
            this.dismiss();
        } else {
            this.selectedPhoto.length = 0;
            this.cameraUtils.startUpdate();
            this.video_.onloadedmetadata = () => {
                this.cameradisplayClass = 'showMyElement';
                this.showHideFilterControl = 'hidemyContainer';
                this.showHideGalaryControl = 'hidemyContainer';
                this.publisherClass = 'hidemyContainer';
                this.showControl = 'showMyElement';
                this.hideControl = 'hidemyContainer';
                this.events.publish(this._eventName + ':close');
                this.gesture = new window['Hammer'](this.video_);
                this.gesture.get('pinch').set({ enable: true });
                //console.log("Got here")
            };
            //this.cameraUtils.start()
            // this.initUserMediaCamera();

        }
    }


    updateCanvasImage() {
        const image: HTMLImageElement = this.snapView.nativeElement;
        image.setAttribute('src', this.image);
        this.cameradisplayClass = 'hidemyContainer';
        this.publisherClass = 'showMyElement';
        this.events.publish(this._eventName + ':close');
    }
    stopCanvasVideo() {
        this.cameradisplayClass = 'showMyElement';
        this.publisherClass = 'hidemyContainer';
        this.showControl = 'hidemyContainer';
        this.hideControl = 'showMyElement';
        this.showHideFlashControl = this.showControl;
        this.stopVideo()

        this.events.publish(this._eventName + ':close');
    }

    dismiss() {
        //this.stopVideo()
        this.events.publish(this._eventName + ':close');

        this.showHideGalaryControl = 'hidemyContainer';
        this.showHideFilterControl = 'hidemyContainer';
        this.viewCtrl.dismiss();
    }
    publishImage() {
        this.stopVideo()
        this.selectedPhoto.length = 0;
        this.events.publish(this._eventName + ':close');
        //this.resizedImage(this.image, 640).then((dataUrl) => {
        //    //console.log(dataUrl)
        //    this.cropImage(dataUrl)
        //    this.stopVideo()
        //})
        //this.generateFromImage(400, 400)
        //    .then((dataUrl) => {
        //        this.cropImage(dataUrl)
        //        this.stopVideo()
        //    })
        //this.cropImage(this.downscaleImage(this.image))
        this.events.publish(this._eventName, this.downscaleImage(this.image));
        setTimeout(() => {
            this.dismiss()
        }, 300)

    }
    publishVideoImage() {
        this.selectedPhoto.length = 0;
        this.events.publish(this._eventName + ':close');
        //this.resizedImage(this.image, 640).then( (dataUrl) => {
        //    this.cropImage(dataUrl)
        //    this.stopVideo()
        //})
        //this.generateFromImage(400, 400)
        //    .then((dataUrl) => {
        //        this.cropImage(dataUrl)
        //        this.stopVideo()
        //    })
        //this.cropImage(this.downscaleImage(this.image))
        this.events.publish(this._eventName, this.downscaleImage(this.image));
        this.stopVideo()
        this.dismiss()

    }

    dataURItoBlob(dataURI) {
        return new Promise((resolve, reject) => {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            resolve(new Blob([new Uint8Array(array)], { type: 'image/jpeg' }))
            //return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
        })
    }

    onTorchCanvas() {
        // var capabilities = this.mediaStream.getCapabilities()
        console.log('torch');

        //if (this.positionDirection == 'environment') {
        if (!this.front) {
            this.flash = this.flash ? false : true;
            this.mediaStream.applyConstraints({
                advanced: [{ torch: this.flash }]
            }).catch(e => console.log(e));
        }
    }

    onSwitchCanvas() {
        //this.front = this.front ? false : true;
        this.SwithCameraButton()
    }

    filterImage(img, filter, density) {
        //compute color intensity for the entire filter and density
        var rIntensity = (filter.r * density + 255 * (100 - density)) / 25500;
        var gIntensity = (filter.g * density + 255 * (100 - density)) / 25500;
        var bIntensity = (filter.b * density + 255 * (100 - density)) / 25500;
        //create canvas and load image
        var canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        //get image data and process the pixels
        var imageData = ctx.getImageData(0, 0, img.width, img.height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = Math.round(rIntensity * luma);
            data[i + 1] = Math.round(gIntensity * luma);
            data[i + 2] = Math.round(bIntensity * luma);
        }
        //put the image data back into canvas
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    flterColors(r, g, b, n): MyResult {
        return {
            r: r,
            g: g,
            b: b,
            c: this.rgbToHex(r, g, b),//r + g + b,
            n: n
        };
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    togleColor() {
        this.showHideFilterControl = (this.showHideFilterControl === 'showMyElement') ? 'hidemyContainer' : 'showMyElement';
    }

    changeColor(id) {
        var img = new Image();
        img.src = this.Originalimage;
        var colorFilter = this.filters[id];//_.sample(this.filters);
        var filteredCanvas = this.filterImage(img, colorFilter, 50);
        var filterImage = filteredCanvas.toDataURL('image/jpeg', 1.0);
        const canvas: HTMLCanvasElement = this.fullsize.nativeElement;
        var ctx = canvas.getContext("2d")
        var image = new Image();
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            this.image = image.src;
        };
        image.src = filterImage;
        //this.showHideFilterControl = 'showMyElement';

    }

    returnBackFilter() {
        const canvas: HTMLCanvasElement = this.fullsize.nativeElement;
        var ctx = canvas.getContext("2d")
        var image = new Image();
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            this.image = image.src;
        };
        image.src = this.Originalimage;
        this.showHideFilterControl = 'hidemyContainer';
    }

    initColorFilter() {

        this.filters.push(this.flterColors(0xFF, 0xFF, 0xFF, 'grayscale')); //grayscale
        this.filters.push(this.flterColors(0xEC, 0x8A, 0x00, 'Warming(85)')); //Warming(85)
        this.filters.push(this.flterColors(0xFA, 0x96, 0x00, 'Warming(LBA)')); //Warming(LBA)
        this.filters.push(this.flterColors(0xEB, 0xB1, 0x13, 'Warming(81)')); //Warming(81)
        this.filters.push(this.flterColors(0x00, 0x6D, 0xFF, 'Warming(81)')); //Coolling(80)
        this.filters.push(this.flterColors(0x00, 0x5D, 0xFF, 'Cooling(LBB)')); //Cooling(LBB)
        this.filters.push(this.flterColors(0x00, 0xB5, 0xFF, 'Cooling(82)')); //Cooling(82)
        this.filters.push(this.flterColors(0xEA, 0x1A, 0x1A, 'Red')); //Red
        this.filters.push(this.flterColors(0xF3, 0x84, 0x17, 'Orange')); //Orange
        this.filters.push(this.flterColors(0xF9, 0xE3, 0x1C, 'Yellow')); //Yellow
        this.filters.push(this.flterColors(0x19, 0xC9, 0x19, 'Green')); //Green
        this.filters.push(this.flterColors(0x1D, 0xCB, 0xEA, 'Cyan')); //Cyan
        this.filters.push(this.flterColors(0x1D, 0x35, 0xEA, 'Blue')); //Blue
        this.filters.push(this.flterColors(0x9B, 0x1D, 0xEA, 'Violet')); //Violet
        this.filters.push(this.flterColors(0xE3, 0x18, 0xE3, 'Magenta')); //Magenta
        this.filters.push(this.flterColors(0xAC, 0x7A, 0x33, 'Sepia')); //Sepia
        this.filters.push(this.flterColors(0xFF, 0x00, 0x00, 'Deep Red')); //Deep Red
        this.filters.push(this.flterColors(0x00, 0x22, 0xCD, 'Deep Blue')); //Deep Blue
        this.filters.push(this.flterColors(0x00, 0x8C, 0x00, 'Deep Emerald')); //Deep Emerald
        this.filters.push(this.flterColors(0xFF, 0xD5, 0x00, 'Deep Yellow')); //Deep Yellow
        this.filters.push(this.flterColors(0x00, 0xC1, 0xB1, 'Underwater')); //Underwater

    }

    // resize
    public resizedImage(file: string, maxWidth: number) {
        return new Promise((resolve, reject) => {
            //let reader = new FileReader();
            //reader.onload = () => {
            let tempImg = new Image();
            tempImg.src = file;//reader.result;

            let createCanvas = (width, height, img) => {
                let canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL())
                //this._dataUrl = canvas.toDataURL();

            }

            tempImg.onload = () => {
                // calc size
                let tempW = tempImg.width;
                let tempH = tempImg.height;
                let min = tempW >= tempH ? tempH : tempW;
                maxWidth = maxWidth || min;

                if (tempH <= maxWidth && tempW <= maxWidth) {
                    createCanvas(tempW, tempH, tempImg);
                }

                let startY = 0;
                if (min !== tempH) {
                    startY = Math.round(tempH / 2 - (min / 2));
                }
                let startX = 0;
                if (min !== tempW) {
                    startX = Math.round(tempW / 2 - (min / 2));
                }

                let finalImg = new Image();
                finalImg.src = this.getImagePortion(tempImg, min, min, startX, startY, 1);

                finalImg.onload = () => {
                    createCanvas(maxWidth, maxWidth, finalImg);
                }
            }
            //}
            //reader.readAsDataURL(file);
        });
    }

    //image crop
    getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio) {
        let tnCanvas = document.createElement('canvas');
        let tnCanvasContext = tnCanvas.getContext('2d');
        tnCanvas.width = newWidth; tnCanvas.height = newHeight;

        let bufferCanvas = document.createElement('canvas');
        let bufferContext = bufferCanvas.getContext('2d');
        bufferCanvas.width = imgObj.width;
        bufferCanvas.height = imgObj.height;
        bufferContext.drawImage(imgObj, 0, 0);

        tnCanvasContext.drawImage(bufferCanvas, startX, startY, newWidth * ratio, newHeight * ratio, 0, 0, newWidth, newHeight);
        return tnCanvas.toDataURL();
    }

    ResizedImageToHalf() {
        return new Promise((resolve, reject) => {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var originalimage = new Image();
            originalimage.onload = function () {
                ctx.drawImage(originalimage, 0, 0);

                var img = new Image();
                img.onload = function () {
                    // set size proportional to image
                    canvas.height = canvas.width * (img.height / img.width);

                    // step 1 - resize to 50%
                    var oc = document.createElement('canvas'),
                        octx = oc.getContext('2d');

                    oc.width = img.width * 0.5;
                    oc.height = img.height * 0.5;
                    octx.drawImage(img, 0, 0, oc.width, oc.height);

                    // step 2
                    octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

                    // step 3, resize to final size
                    ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
                        0, 0, canvas.width, canvas.height);

                    resolve(canvas.toDataURL())
                }
                img.src = originalimage.src;
            };
            originalimage.src = this.image;
        });
    }

    generateFromImage(MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1) {
        return new Promise((resolve, reject) => {
            var canvas: any = document.createElement("canvas");
            var image = new Image();

            image.onload = () => {
                var width = image.width;
                var height = image.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, width, height);

                // IMPORTANT: 'jpeg' NOT 'jpg'
                var dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl)
                //callback(dataUrl)
            }
            image.src = this.image;
        });
    }

    downscaleImage(dataUrl) {
        "use strict";
        var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl;

        // Provide default values
        //var imageType = "image/jpeg";

        var imageType = "image/webp";
        var imageArguments = imageArguments || 1;


        // Create a temporary image so that we can compute the height of the downscaled image.
        image = new Image();
        image.src = dataUrl;
        oldWidth = image.width;
        oldHeight = image.height;
        //var newWidth = oldWidth/4;
        //newHeight = Math.floor(oldHeight / oldWidth * newWidth)

        ////// Create a temporary canvas to draw the downscaled image on.
        //canvas = document.createElement("canvas");
        //canvas.width = newWidth;
        //canvas.height = newHeight;
        canvas = document.createElement("canvas");
        canvas.width = oldWidth;
        canvas.height = oldHeight;

        // Draw the downscaled image on the canvas and return the new data URL.
        ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, oldWidth, oldHeight);

        newDataUrl = canvas.toDataURL(imageType, imageArguments);
        //console.log(newDataUrl)
        return newDataUrl;
    }



}
