import {Component} from '@angular/core';
import {NavParams, ViewController, ActionSheetController , Events, Platform} from 'ionic-angular';
declare const Cropper: any;
declare const document: any;

@Component({
    selector   : 'ion-photo-crop-modal',
    templateUrl: 'ion-photo-crop-modal.html'
})
export class IonPhotoCropModal {

    img: any;
    image: any;
    cropper: any;
    _eventName: string;

    constructor(private navParams: NavParams,
        private viewCtrl: ViewController,
        private actionSheetCtrl: ActionSheetController ,
                private events: Events,
                private platform: Platform
    ) {
        this._eventName = this.navParams.get('eventName')
        this.img        = this.navParams.get('base64');

        this.events.subscribe('photocrop:close', () => this.dismiss());
        this.platform.registerBackButtonAction(() => this.dismiss());
    }

    ionViewDidLoad() {
        this.imageLoaded();
    }

    // image Crop Method
    imageLoaded() {
        let image    = document.getElementById('image');
        this.cropper = new Cropper(image, {
            aspectRatio             : 1 / 1,
            dragMode                : 'move',
            autoCropArea            : 1,
            viewMode                : 1,
            restore                 : true,
            guides                  : true,
            center                  : true,
            highlight               : true,
            cropBoxMovable          : true,
            cropBoxResizable: true,
           // minCropBoxHeight: 350,
            minWidth: 350,
            minHeight: 350,
            maxWidth: 450,
            maxHeight: 450,
            imageSmoothingQuality: 'high',
            //toggleDragModeOnDblclick: false,
            responsive              : true,
            //minCanvasWidth          : 640,
            //minContainerWidth       : 640,
            //crop        : (event) => {
            //
            //    //this.image = event.target.currentSrc;
            //    //this.image = event.getCroppedCanvas().toDataURL('image/jpeg');
            //}
        });
    }

    crop() {
        let image = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
        this.events.publish(this._eventName, image);
        console.log(this._eventName)
      
       // this.presentActionSheet(image);
        this.dismiss();
    }

    rotate(value: number): void {
        this.cropper.rotate(value);
    }


    presentActionSheet(image) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Photo Action Type ?',
            buttons: [
                {
                    text: 'Create upcoming event',
                    icon: 'calendar',
                    //role: 'destructive',
                    handler: () => {
                        console.log('Share New Upcoming Event');
                        //this._eventName+"upcoming"
                        this.events.publish(this._eventName+"upcoming", image);
                        this.dismiss();
                    }
                },
                {
                    text: 'Share timeline moment ',
                    icon:'clock',
                    handler: () => {
                        this.events.publish(this._eventName, image);
                        this.dismiss();
                        console.log('Archive clicked');
                    }
                }
                //,
                //{
                //    text: 'Cancel',
                //    role: 'cancel',
                //    handler: () => {
                //        console.log('Cancel clicked');
                //    }
                //}
            ]
        });

        actionSheet.present();
    }


    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
