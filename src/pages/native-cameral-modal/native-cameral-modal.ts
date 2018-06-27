/// <reference path="../../pipes/cdvphotolibrary.pipe.ts" />
import {Component, Output, NgZone, ViewChild, ElementRef, Renderer, EventEmitter} from "@angular/core";
import {Events, IonicPage, ModalController, NavParams, Platform, ViewController, normalizeURL} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
//import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";
import {IonPhotoCanvasService} from "../../modules/ion-photo/ion-photo-canvas-service";
import {IonPhotoCropModal} from "../../modules/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import { ImageCompressService, ResizeOptions, ImageUtilityService, IImage, SourceImage } from  'ng2-image-compress';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DomSanitizer } from '@angular/platform-browser';
import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";
//import { File } from '@ionic-native/file';

import { Observable } from "rxjs/Rx";
import { of } from 'rxjs/observable/of';

import _ from "underscore";
declare const window: any;
declare const cordova: any;
declare const Cropper: any;
declare const document: HTMLDocument;

interface MyResult {
    r: any;
    g: any;
    b: any;
    c: any;
    n: any;
}


@IonicPage()
@Component({
    selector: 'native-cameral-modal',
    templateUrl: 'native-cameral-modal.html'
})

export class NativeCameraModalPage {
    @ViewChild('inputFile') input: ElementRef;
    @ViewChild('fullsize') fullsize: ElementRef;
    @ViewChild('snapView') snapView: ElementRef;
    @ViewChild('cropImageView') cropImageView: ElementRef;
    @ViewChild('publisher') publisher: ElementRef;
    @ViewChild('cameradisplay') cameradisplay: ElementRef;

    //myWorker = new Worker('./assets/workers/worker.js');
   // MT = new window.Multithread(2);
    cordova: boolean = false;
    hideCropIcon: boolean = false;
    cropper: any;
    _eventName: string;
    image: any;
    Originalimage: any;
    //positionDirection: String = 'environment'//'user'
    drawerOptions: any;
    selectedPhoto = new Array()
    cameradisplayClass: string = 'hidemyContainer';
    publisherClass: string = 'hidemyContainer';
    showHideFilterControl: string = 'hidemyContainer';
    photoControClass: string = 'hidemyContainer';
    CropControClass: string = 'hidemyContainer';
    filters = new Array();
    filtersImagesArray: any = new Array();
    @Output() update: EventEmitter<any[]> = new EventEmitter<any[]>(true);
    galaryObject: any;
    img: any;
    drawerCropOptions: any;
  
    constructor(private viewCtrl: ViewController,
        private ionPhotoCanvasService: IonPhotoCanvasService,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
        private events: Events,
        private render: Renderer,
        private analytics: AnalyticsProvider,
        private navParams: NavParams,
        private platform: Platform,
        private ngZone: NgZone,
        private imgCompressService: ImageCompressService,
        private ng2ImgMax: Ng2ImgMaxService,
        public sanitizer: DomSanitizer,
        private photoService: IonPhotoService,
        //private file: File,
    ) {
        // Google Analytics
        this.analytics.view('TabCapturePage');
        this.cordova = this.util.cordova;
        this._eventName = this.navParams.get('eventName');
        this.image = this.navParams.get('image');
        this.Originalimage = this.navParams.get('image');
        this.img = this.image;
    

        if (!this.cordova) {
            setTimeout(() => this.render.invokeElementMethod(this.input.nativeElement, 'click'), 500);
        }
     
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

    processWorkerOnMessage() {
        //this.myWorker.onmessage = (event) => {
        //    this.ngZone.run(() => {
        //        this.filtersImagesArray = event.data.filteredList;
        //    })
        //};
    }

    doImagesFilter() {
       
    }

    nomalizeFileUrl(url) {
        //let path = cordova.file.dataDirectory;
        let path = encodeURI(normalizeURL(url));
        console.log(path);
        return path;
    }

    ionViewWillEnter() {
        this._eventName = this.navParams.get('eventName');
        this.image = this.navParams.get('image');
        this.Originalimage = this.navParams.get('image');
        this.openCapture()
        //this.events.publish('tabHome')
    }

    ionViewDidEnter() {
        //if (this.cordova) {
        //    this.ionPhotoCanvasService.getOutput().subscribe((val) => {
        //        //console.log(val)
        //        this.galaryObject = val;
        //    });
        //}
        this.initColorFilter();
    }

    ionViewDidLeave() {
    }

    dataURLtoFile() {
        var dataurl = this.image;
        return new Promise((resolve, reject) => {
            var filename = "nameimge.jpg"
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            resolve(new File([u8arr], filename, { type: mime }))
            //return new File([u8arr], filename, { type: mime });
        })
    }

    compressImageFile()
    {
           //let images: IImage
        return new Promise((resolve, reject) => {
        this.dataURLtoFile()
            .then((datafile: File) => {
                var myarrayFile= [];
                myarrayFile.push(datafile)
                ImageCompressService.filesArrayToCompressedImageSource(myarrayFile).then(observableImages => {
                    observableImages.subscribe((image) => {
                        resolve(image.imageDataUrl)
                    }, (error) => {
                        console.log("Error while converting");
                    }, () => {
                        
                    });
                });
            })
       
        });
    }

    compressOrResize() {
        return new Promise((resolve, reject) => {
           
            this.dataURLtoFile()
                .then((image: File) => {
                   // this.ng2ImgMax.compressImage(image, 0.150).subscribe(
                    this.ng2ImgMax.resizeImage(image, 800, 500).subscribe(
                        result => {
                            const reader: FileReader = new FileReader();
                            reader.onload = (evt) => {
                                if (evt) {
                                   // let image = atob(reader.result.split(',')[1]);
                                    let image = reader.result;//.split(',')[1];
                                        //this.sanitizer.bypassSecurityTrustUrl(evt.srcElement['result']);
                                    //console.log(image)
                                    //resolve(this.sanitizer.bypassSecurityTrustUrl(image))
                                    resolve(image)
                                }
                            };
                            reader.readAsDataURL(result);
                            //window.URL.createObjectURL()
                        },
                        error => {
                            console.log( error);
                        }
                    );
                })
        });
    }

   

    openCapture() {
        this.publisherClass = 'hidemyContainer';
        this.cameradisplayClass = 'hidemyContainer';
        this.showHideFilterControl = 'hidemyContainer';

        if (this.cordova) {
            this.cameradisplayClass = 'showMyElement';
            this.photoControClass = 'showMyElement';
            this.events.publish(this._eventName + ':close');
        } else {
            //this.events.publish('tabHome')
            //this.render.invokeElementMethod(this.input.nativeElement, 'click');
            this.publisherClass = 'showMyElement';
            this.cameradisplayClass = 'hidemyContainer';
        }
        this.updateCanvasImage();
        //this.updateFilterImage();
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
                    this.Originalimage = image;
                    this.updateCanvasImage();
                    this.photoControClass = 'showMyElement';
                    this.CropControClass = 'hidemyContainer';
                    this.showHideFilterControl = 'hidemyContainer';
                    //this.updateFilterImage();
                    this.updateFilterImage()
                }
            };
            reader.readAsDataURL(image);
        }
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
                    // const image: HTMLImageElement = this.snapView.nativeElement;
                    // image.setAttribute('src', dataUrl);
                    this.image = dataUrl;
                    this.Originalimage = dataUrl;
                    this.updateCanvasImage();
                    this.cameradisplayClass = 'showMyElement';
                    this.showHideFilterControl = 'hidemyContainer';
                    this.publisherClass = 'hidemyContainer';
                    this.events.publish(this._eventName + ':close');
                    this.updateFilterImage()
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
            //this.drawerOptions.showTitle = " Photo Library"
            //this.events.publish(this._eventName + ':open');
            this.photoService.openGalaryOnly().then((dataUrl) => {
                this.image = dataUrl;
                this.Originalimage = dataUrl;
                this.updateCanvasImage();
                this.cameradisplayClass = 'showMyElement';
                this.showHideFilterControl = 'hidemyContainer';
                this.publisherClass = 'hidemyContainer';
                this.events.publish(this._eventName + ':close');
                this.updateFilterImage()
            })

        } else {
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
    }

    dismissPublish() {
        this.events.publish(this._eventName + ':close');
        this.dismiss();
    }

    updateCanvasImage() {
        let myimage: HTMLImageElement;
        if (this.cordova) {
            myimage = this.fullsize.nativeElement;
        } else {
            myimage = this.snapView.nativeElement;
        }
        myimage.setAttribute("src", this.image)
        //this.showHideFilterControl = 'hidemyContainer';
        this.events.publish(this._eventName + ':close');
    }

    dismiss() {
        this.events.publish(this._eventName + ':close');
        this.showHideFilterControl = 'hidemyContainer';
        this.viewCtrl.dismiss();
    }
    publishImage() {
        //this.compressImageFile().then((datafile) => { 
        //this.compressOrResize().then((datafile) => { 
        this.selectedPhoto.length = 0;
        this.events.publish(this._eventName + ':close');
        //this.events.publish(this._eventName, this.downscaleImage(this.image));
        this.downscaleImage(this.image).then((data) => {
            this.events.publish(this._eventName, data );
        setTimeout(() => {
            this.dismiss()
        }, 1000)
        })
        //console.log(datafile)
        //});

    }
    //publishProcessedImage() {
    //    //this.compressImageFile().then((datafile) => { 
    //    this.compressOrResize().then((datafile) => { 
    //    this.selectedPhoto.length = 0;
    //    this.events.publish(this._eventName + ':close');
    //    //this.cropImage(this.downscaleImage(this.image))
    //    //this.events.publish(this._eventName, this.downscaleImage(this.image));
    //    this.events.publish(this._eventName, this.downscaleImage(datafile));
    //    setTimeout(() => {
    //        this.dismiss()
    //    }, 1000)
    //    //console.log(datafile)
    //    });
    //}

    cropPhoto() {
        return new Promise((resolve, reject) => {
            this.drawerOptions.showTitle = "Crop Photo"
            this.imageLoaded()
                .then(() => {
                    this.photoControClass = 'hidemyContainer';
                    this.CropControClass = 'showMyElement';
                    this.events.publish(this._eventName + ':openCrop');
                })
            resolve("OK")
        })

    }

    // image Crop Method
    imageLoaded() {
        return new Promise((resolve, reject) => {
            if (this.cropper) {
                this.cropper.destroy()
            }
            let image = document.getElementById('image');
            image.setAttribute("src", this.image);
            this.cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                dragMode: 'move',
                autoCropArea: 0,
                viewMode: 1,
                restore: true,
                guides: true,
                center: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                //maxCropBoxHeight: 500,
                minCropBoxHeight: 400,
                //minWidth: 350,
                //minHeight: 350,
                //maxWidth: 450,
                //maxHeight: 450,
                imageSmoothingQuality: 'high',
                //toggleDragModeOnDblclick: false,
                responsive: true,
                //maxCanvasWidth: (image.width),
                //maxCanvasHeight: (image.height),
                minContainerWidth: (window.innerWidth / 1.1),
                minContainerHeight: (window.innerHeight / 1.2),
                minCanvasWidth: (window.innerWidth / 1.1),
                minCanvasHeight: (window.innerHeight / 1.2),

            });

            resolve("OK")

        })

    }

    crop() {
        //let canvas: HTMLCanvasElement;
        let myimage: HTMLImageElement;
        if (this.cordova) {
            this.cameradisplayClass = 'showMyElement';
            this.showHideFilterControl = 'hidemyContainer';
            this.publisherClass = 'hidemyContainer';
            myimage = this.fullsize.nativeElement;
        } else {
            this.cameradisplayClass = 'hidemyContainer';
            this.showHideFilterControl = 'hidemyContainer';
            this.publisherClass = 'showMyElement';
            myimage = this.snapView.nativeElement;
        }
        // canvas = this.cropper.getCroppedCanvas();
        let imagecrop = this.cropper.getCroppedCanvas().toDataURL('image/jpg');
        myimage.setAttribute("src", imagecrop)
        this.image = imagecrop;
        this.hideCropIcon = true;
        this.photoControClass = 'showMyElement';
        this.CropControClass = 'hidemyContainer';

        this.events.publish(this._eventName + ':close');
        //this.cropper.destroy() 
    }

    rotate(value: number): void {
        this.cropper.rotate(value);
    }


    dataURItoBlob(dataURI) {
        return new Promise((resolve, reject) => {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            resolve(new Blob([new Uint8Array(array)], { type: 'image/jpg' }))
            //return new Blob([new Uint8Array(array)], { type: 'image/jpg' });
        })
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
        ctx.drawImage(img, 0, 0, img.width, img.height);
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

    togleHideColor() {
        this.showHideFilterControl = 'hidemyContainer';
    }

    changeColor(id) {
        var img = new Image();
        img.onload = () => {

            var colorFilter = this.filters[id];//_.sample(this.filters);
            var filteredCanvas = this.filterImage(img, colorFilter, 50);
            var filterImage = filteredCanvas.toDataURL('image/jpg', 1.0);
            this.image = filterImage;
            this.img = this.image
            //this.showHideFilterControl = 'showMyElement';
            this.updateCanvasImage();
        };
        img.src = this.Originalimage;
    }


    returnBackFilter() {
        //let canvas: HTMLCanvasElement = document.createElement("canvas");
        let myimage: HTMLImageElement;
        //const canvas: HTMLCanvasElement = this.fullsize.nativeElement;
        if (this.cordova) {
            myimage = this.fullsize.nativeElement;
        } else {
            myimage = this.snapView.nativeElement;
        }
        //var ctx = canvas.getContext("2d")
        var image = new Image();
        image.onload = () => {
            this.image = image.src;
            myimage.setAttribute("src", this.image)
        };
        image.src = this.Originalimage;
        this.hideCropIcon = false
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
        this.updateFilterImage()
    }

    //updateFilterImage() {

    //    //var arr = [];
    //    ////this.filtersImagesArray = [];
    //    //this.filters.forEach((v, i) => {
    //    //    var img = new Image();
    //    //    img.onload = () => {
    //    //        var filteredCanvas = this.filterImage(img, v, 50);
    //    //        arr.push(filteredCanvas.toDataURL('image/webp', 1.0));
    //    //    };
    //    //    img.src = this.Originalimage;
    //    //})

    //    //this.events.publish('photoFilter', null);
    //    //this.update.emit(arr)
    //    // this.doImagesFilter();
    //    this.MT.process(function () {
    //        //this.filtersImagesArray = [];
    //        var arr = [];
    //        this.filters.forEach((v, i) => {
    //            console.log(i)
    //            var img = new Image();
    //            img.onload = () => {
    //                var filteredCanvas = this.filterImage(img, v, 50);
    //                arr.push(filteredCanvas.toDataURL('image/webp', 1.0));
    //            };
    //            img.src = this.Originalimage;
    //        })
    //        return arr;
    //    }, function (result) {
    //        this.ngZone.run(() => {
    //            this.filtersImagesArray = result;
    //        })
    //    });
    //}
    updateFilterImage() {
        //var myfilters = this.filters;
        //var imgUrl = this.Originalimage;
        
        //var myprocess = this.MT.process((myfilters, img, canvas, ctx, arr) => {
        //    //this.filtersImagesArray = [];
        //    //console.log(JSON.stringify(myfilters))
        //    myfilters.forEach((v, index) => {

        //        var rIntensity = (v.r * 50 + 255 * (100 - 50)) / 25500;
        //        var gIntensity = (v.g * 50 + 255 * (100 - 50)) / 25500;
        //        var bIntensity = (v.b * 50 + 255 * (100 - 50)) / 25500;
        //        //create canvas and load image
        //        //var canvas: HTMLCanvasElement = document.createElement("canvas");
        //        //canvas.width = img.width;
        //        //canvas.height = img.height;
        //        //var ctx = canvas.getContext("2d");
        //        ctx.drawImage(img, 0, 0, img.width, img.height);
        //        //get image data and process the pixels
        //        var imageData = ctx.getImageData(0, 0, img.width, img.height);
        //        var data = imageData.data;
        //        for (var i = 0; i < data.length; i += 4) {
        //            var luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        //            data[i] = Math.round(rIntensity * luma);
        //            data[i + 1] = Math.round(gIntensity * luma);
        //            data[i + 2] = Math.round(bIntensity * luma);
        //        }
        //        //put the image data back into canvas
        //        ctx.putImageData(imageData, 0, 0);


        //        //var filteredCanvas = this.filterImage(img, v, 50);
        //        //var filteredCanvas =3
        //       // console.log(JSON.stringify(filteredCanvas))
        //        //var img = new Image();
        //        //img.onload = () => {
        //        //    var filteredCanvas = this.filterImage(img, v, 50);
        //        //    console.log(filteredCanvas)
        //        //    arr.push(filteredCanvas.toDataURL('image/webp', 1.0));
        //        //};
        //        //img.src = imgUrl;
        //    })


        //    return arr;
        //}, (result) => {
        //    this.ngZone.run(() => {
        //        //console.log(result)
        //        this.filtersImagesArray = result;
        //    })
        //});
        //var img = new Image();
        //img.onload = () => {
        //    var arr = [];
        //    var canvas: HTMLCanvasElement = document.createElement("canvas");
        //    canvas.width = img.width;
        //    canvas.height = img.height;
        //    var ctx = canvas.getContext("2d");
        //    myprocess(this.filters, img, canvas, ctx, arr);
        //}
        //img.src = this.Originalimage;
       
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
                var dataUrl = canvas.toDataURL('image/jpg', quality);
                resolve(dataUrl)
                //callback(dataUrl)
            }
            image.src = this.image;
        });
    }

    downscaleImage(dataUrl) {
        return new Promise((resolve, reject) => {
        var image, canvas, ctx, newDataUrl;

        var imageType = "image/webp";
        var imageArguments = imageArguments || 70;
        // Create a temporary image so that we can compute the height of the downscaled image.
        image = new Image();
        image.onload = () => {
           
            canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;;
            canvas.height = image.naturalHeight;;
            // Draw the downscaled image on the canvas and return the new data URL.
            ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            newDataUrl = canvas.toDataURL(imageType, imageArguments / 100);
            resolve(newDataUrl)
            //console.log(newDataUrl)
        }
        image.src = dataUrl;
        });
        //return this.sanitizer.bypassSecurityTrustUrl(newDataUrl);
    }



}
