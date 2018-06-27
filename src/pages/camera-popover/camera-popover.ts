import {Component, ViewChild, ElementRef, Renderer} from '@angular/core';
import {ViewController, NavParams, ModalController, AlertController, Events, IonicPage} from 'ionic-angular';
import {IonicUtilProvider} from '../../providers/ionic-util/ionic-util';
import {IonPhotoCropModal} from "../../modules/ion-photo/ion-photo-crop-modal/ion-photo-crop-modal";
import {CameraldModalPage} from "../../pages/cameral-modal/cameral-modal";
import {IonPhotoService} from "../../modules/ion-photo/ion-photo-service";

@IonicPage()
@Component({
    selector: 'camera-popover',
    template: `
    <ion-list>
      <button ion-item tappable (click)="openUpcomingCapture()">  <ion-icon color="primary" name="camera"></ion-icon> {{'Add Upcoming ' | translate}}</button>
      <button  ion-item tappable (click)="openShareCapture()">  <ion-icon color="primary" name="camera"></ion-icon> {{ 'Add Photo ' | translate}}</button>
      <button  ion-item tappable (click)="close()">  <ion-icon color="primary" name="close"></ion-icon> {{ 'Cancel' | translate}}</button>
    </ion-list>
 <input *ngIf="!cordova"
       #inputFile
       type="file"
       (change)="onChange($event)"
       accept="image/x-png, image/gif, image/jpeg"
       max-size="2048"
       style="display: none;">

  `
})
export class CameraPopoverPage {

    @ViewChild('inputFile') input: ElementRef;
    cordova: boolean = false;
    _eventName: string = 'photoshare';
    cropmodal: any;


    constructor(private viewCtrl: ViewController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private ionicUtil: IonicUtilProvider,
        private events: Events,
        private render: Renderer,
        private modalCtrl: ModalController,
        private util: IonicUtilProvider,
        private photoService: IonPhotoService,
    ) {
        this.events.unsubscribe('photoshareupcoming', null);
        this.events.unsubscribe('photoshare', null);
        this.events.subscribe('photoshare', _imageCroped => {
            let modal = this.modalCtrl.create('PhotoShareModalPage', { base64: _imageCroped });
            modal.onDidDismiss(response => {
                console.log(response);
                if (response) {
                    this.events.publish('upload:gallery', response);
                    // this.dismiss()
                }
            });
            modal.present();

        });

        this.events.subscribe('photoshareupcoming', _imageCroped => {
            let modal = this.modalCtrl.create('PhotoShareEventModalPage', { base64: _imageCroped });
            modal.onDidDismiss(form => {
                if (form) {
                    this.events.publish('uploadupcoming:gallery', form);
                    // this.dismiss()
                }

            });
            modal.present();

        });
    }

    //openUpcomingCapture() {
    //  //  this._eventName = this._eventName+ "upcoming"
    //    this.close() 
    //    this.modalCtrl.create('CameraldModalPage', { eventName: 'photoshareupcoming' }).present();
    //}
    //openShareCapture() {
    //    this._eventName = 'photoshare'
    //    this.close() 
    //    this.modalCtrl.create('CameraldModalPage', { eventName: 'photoshare' }).present();
        
    //}

    //onDidDismiss(){
    //    alert("Going...")
    // }

    openShareCapture() {
        this.events.publish('tabHome')
        //this.close() 
        this._eventName = 'photoshare';
        this.openCapture()
    }

    openUpcomingCapture() {
        this.events.publish('tabHome')
        //this.close() 
        this._eventName = 'photoshareupcoming';
        this.openCapture()
    }


    openCapture() {
        this.close() 
        if (this.cordova) {
            this.events.publish('OpenphotoService:gallery', this._eventName);
            //this.photoService.open()
            //    //.then(image => this.cropImage(image))
            //    .then(image => {
            //        this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
            //        this.close()
            //    })
            //    .catch(error => this.util.toast(error));
            //  this.photoService.onPlayCanvas();
        } else {
            this.events.publish('tabHome')
            this.render.invokeElementMethod(this.input.nativeElement, 'click');
        }
        
    }

    cropImage(image: any) {
        this.close() 
        this.modalCtrl.create(IonPhotoCropModal, { base64: image, eventName: this._eventName }).present();
    }

    onChange(event) {
        //console.log(event)
        let files = event.srcElement.files;
        let image = files[0];
        let reader = new FileReader();
        if (image) {
            reader.onload = (evt) => {
                if (evt) {
                  
                    let image = evt.srcElement['result'];
                    //this.cropImage(image)
                    this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
                    this.close()
                }
            };
            reader.readAsDataURL(image);
        }
    }

    close() {
        this.viewCtrl.dismiss();
    }

}
