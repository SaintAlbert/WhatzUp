/// <reference path="../../pages/permissions/permissions.ts" />
import { Injectable, ApplicationRef } from '@angular/core'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { TranslateService } from '@ngx-translate/core'
import { Platform, ToastController, ModalController } from 'ionic-angular'
import { PhotoLibrary } from '@ionic-native/photo-library';
//import { Observable } from 'rxjs/Observable';
import { Observable, ReplaySubject } from "rxjs/Rx";
import { of } from 'rxjs/observable/of';
import { PermissionsPage } from '../../pages/permissions/permissions';

declare const window: any;
declare var cordova;
declare var navigator: any
declare var MediaStream: any


@Injectable()
export class IonPhotoCanvasService {
    output: ReplaySubject<any> = new ReplaySubject<any>();
    library: any;
    _base64Image: any
    _cordova: boolean = false
    video: any
    canvas: HTMLCanvasElement

    flash: boolean = false
    position: String = 'back'
    positionDirection: String = 'environment'
    galaryLibrary: Observable<any>;
    _translateOption: string
    _translateCamera: string
    _translateLibrary: string
    _translateCancel: string
    _translateNotCordova: string


    constructor(
        private platform: Platform,
        private translateService: TranslateService,
        public photoLibrary: PhotoLibrary,
        private cd: ApplicationRef,
        private sanitizer: DomSanitizer,
        private toastCtrl: ToastController,
        private modalCtrl: ModalController) {
        this._cordova = this.platform.is('cordova') ? true : false
        // Translate
        this.translate('Chose Option').then(result => this._translateOption = result)
        this.translate('Camera').then(result => this._translateCamera = result)
        this.translate('Photo library').then(result => this._translateLibrary = result)
        this.translate('Cancel').then(result => this._translateCancel = result)
        this.translate('Browser not supported').then(result => this._translateNotCordova = result)

        //this.onGalary();
        if (this._cordova) {
            this.library = [];
            this.fetchPhotos();
        }
    }

    translate(text: string): Promise<any> {
        return new Promise(resolve => {
            this.translateService.get(text).subscribe((res: string) => resolve(res))
        })
    }

   

    // Update DOM on a Received Event
    initKeithCanvas(fullsize) {
        if (this._cordova) {
            window.plugin.CanvasCamera.initialize(fullsize);
            var options = {
                quality: 75,
                destinationType: window.plugin.CanvasCamera.DestinationType.DATA_URL,
                encodingType: window.plugin.CanvasCamera.EncodingType.JPEG,
                saveToPhotoAlbum: false,
                correctOrientation: false,
                width: 640,
                height: 640
            };
            window.plugin.CanvasCamera.start(options);
            window.plugin.CanvasCamera.setFlashMode(2);

        }

    }

    initialize(fullsize) {
        if (this._cordova) {
            if (window.plugin.CanvasCamera) {
                window.plugin.CanvasCamera.initialize({
                    fullsize: fullsize
                });

                this.onPlay();
            }
        }
    }
    onPlay() {
        console.log('play');
        if (this._cordova) {
            if (window.plugin.CanvasCamera) {
                return new Promise((resolve, reject) => {
                    var options = {
                        canvas: {
                            width: 640,
                            height: 640
                        },
                        capture: {
                            width: 640,
                            height: 640
                        },
                        use: 'file',
                        fps: 90,
                        flashMode: this.flash,
                        hasThumbnail: false,
                        thumbnailRatio: 1 / 6,
                        cameraFacing: this.position,
                        onBeforeDraw: function (frame) {
                            // do something before drawing a frame
                        },
                        onAfterDraw: function (frame) {
                            // do something after drawing a frame
                        }
                    };
                    window.plugin.CanvasCamera.start(options, function (error) {
                        console.log('[CanvasCamera start]', 'error', error);
                        reject(error)
                    }, function (data) {
                        resolve(data)
                        // console.log('[CanvasCamera start]', 'data', data);
                    });
                });
            }
        }
    }

    onTorch() {
        console.log('torch');
        if (this._cordova) {
            if (window.plugin.CanvasCamera) {
                return new Promise((resolve, reject) => {
                    this.flash = (this.flash) ? false : true;
                    window.plugin.CanvasCamera.flashMode(this.flash, function (error) {
                        console.log('[CanvasCamera flashMode]', 'error', error);
                        reject(error)
                    }, function (data) {
                        resolve(this.flash)
                        console.log('[CanvasCamera flashMode]', 'data', data);
                    });
                });
            }
        }
        else {
            return new Promise(reject => {
                reject("Not in native")
            })
        }
    }

    onSwitch() {
        console.log('switch');
        if (this._cordova) {
            if (window.plugin.CanvasCamera) {
                return new Promise((resolve, reject) => {
                    this.position = (this.position === 'front') ? 'back' : 'front';
                    window.plugin.CanvasCamera.cameraPosition(this.position, function (error) {
                        console.log('[CanvasCamera cameraPosition]', error);
                        reject(error)
                    }, function (data) {
                        resolve(this.position)
                        console.log('[CanvasCamera cameraPosition]', 'data', data);
                    });
                })
            }
        }
        else {
            return new Promise(reject => {
                reject("Not in native")
            })
        }

    }
    onStop() {
        console.log('stop');
        if (this._cordova) {
            if (window.plugin.CanvasCamera) {
                return new Promise((resolve, reject) => {
                    window.plugin.CanvasCamera.stop(function (error) {
                        reject(error)
                        console.log('[CanvasCamera stop]', 'error', error);
                    }, function (data) {
                        resolve(data)
                        console.log('[CanvasCamera stop]', 'data', data);
                    });
                })
            }
        }
        else {
            return new Promise(reject => {
                reject("Not in native")
            })
        }
    }

    offFlash() {
        if (this._cordova) {
            return new Promise((resolve, reject) => {
                window.plugin.CanvasCamera.flashMode(false, function (error) {
                    reject(error)
                    console.log('[CanvasCamera flashMode]', 'error', error);
                }, function (data) {
                    resolve(data)
                    console.log('[CanvasCamera flashMode]', 'data', data);
                });
            });
        }
    }

    onGalary() {

        if (this._cordova) {
            this.photoLibrary.requestAuthorization().then(() => {
                this.photoLibrary.getLibrary()
                    .subscribe({
                        next: library => {
                            this.galaryLibrary = of(library);

                        }
                    });
            });

        }

    }

    getLaberyImage(libraryItemId) {
        return new Promise((resolve, reject) => {
            this.photoLibrary.getPhoto(libraryItemId)
                .then((data) => {
                    resolve(data)
                })
        });
    }

    fetchPhotos() {
        this.platform.ready().then(() => {

            this.library = [];
            this.photoLibrary.requestAuthorization().then(() => {
                this.photoLibrary.getLibrary({
                    thumbnailWidth: 512,
                    thumbnailHeight: 384,
                    itemsInChunk: 20,
                    chunkTimeSec: 0.5,
                    useOriginalFileNames: false
                }).subscribe({
                    next: (chunk) => {
                        this.library = this.library.concat(chunk);
                        //this.library = this.library.slice(0, 9); // To take top 10 images
                        //this.cd.detectChanges();
                        this.output.next(this.library);
                        this.cd.tick();
                    },
                    error: (err: string) => {
                        if (err.startsWith('Permission')) {

                            let permissionsModal = this.modalCtrl.create(PermissionsPage);
                            permissionsModal.onDidDismiss(() => {
                                // retry
                                this.fetchPhotos();
                            });
                            permissionsModal.present();

                        } else { // Real error
                            let toast = this.toastCtrl.create({
                                message: `getLibrary error: ${err}`,
                                duration: 6000,
                            });
                            toast.present();
                        }
                    
                        //if (err.startsWith('Permission')) {
                        //    console.log('permissions weren\'t granted')
                        //} else { // Real error
                        //    console.log('getLibrary error: ');
                        //    console.log(err);
                        //}
                    },
                    complete: () => {
                        // Library completely loaded
                        console.log('done getting photos');
                    }
                });
            });
        });

    }

    getOutput(): Observable<any> {
        return this.output;
    }

    sanitizeimgUrl(imgUrl) {
        let url: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(imgUrl);
        return url;
    }



}
