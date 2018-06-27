import {Injectable} from "@angular/core";

declare const window: any;
declare var navigator: any
declare var MediaStream: any

@Injectable()
export class CameraUtils {
    devices: any
    streamRef: any
    currentDevice: any
    video: any
    canvas: HTMLCanvasElement
    constructor() {

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                // First get ahold of the legacy getUserMedia, if present
                var getUserMedia = (navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.getUserMedia);

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }
        /*
                   redacted for clarity
        */
        this.devices = [];
        this.currentDevice = 0;
        //this.canvas = canvas;
        //this.video = video;
    }

    fitImage(image) {
        /*
                   redacted for clarity
        */
    }

    boot() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                this.devices = devices.filter(dev => dev.kind === 'videoinput');
                resolve(this.devices);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    start() {
        //this.boot().then((devices) => {
        return new Promise((resolve, reject) => {
            //this.boot().then((devices) => {
                navigator.mediaDevices
                    .getUserMedia({
                        video: {
                            //deviceId: this.devices[this.currentDevice].deviceId,
                            //deviceId: devices[this.currentDevice].deviceId,
                        },
                        audio: false,
                    })
                    .then(stream => {
                        this.streamRef = stream;
                        this.video.srcObject = stream;
                        //this.video.play();
                        //this.loop = new Loop(
                        //    { fps: 60, frameskip: 17},
                        //    frame => {
                        //if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                            //this.fitImage(this.video);
                        resolve(this.devices)
                        //}
                        //    },
                        //    frame => {}
                        //);
                        //this.loop.start();
                    })
                    .catch(err => {
                        /*
                                   redacted for clarity
                        */
                        reject(err);
                    });
           // });
        });
    }

    startUpdate() {
        //this.boot().then((devices) => {

        navigator.mediaDevices
            .getUserMedia({
                video: {
                    deviceId: this.devices[this.currentDevice].deviceId,
                },
                audio: false,
            })
            .then(stream => {
                this.streamRef = stream;
                this.video.srcObject = new MediaStream([stream.getVideoTracks()[0]]) ;
             
            })
            .catch(err => {
                /*
                           redacted for clarity
                */
            });
        //});
    }

    stop() {
        this.streamRef.getTracks().forEach(track => {
            track.stop();
        });
    }

    export() {
        return this.canvas.toDataURL("image/jpeg", 0.75);
    }

    switch() {
        this.stop();
        const i = this.currentDevice;
        if (!!this.devices.length && i < this.devices.length - 1) {
            this.currentDevice += 1;
        } else {
            this.currentDevice = 0;
        }
        this.startUpdate();
    }
}

