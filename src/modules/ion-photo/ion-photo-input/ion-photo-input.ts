import { Component, ElementRef, EventEmitter, Output, Renderer, ViewChild } from '@angular/core'
import { IonPhotoService } from '../ion-photo-service'
import { Events, ModalController, Platform, ToastController } from 'ionic-angular'
import { IonPhotoCropModal } from '../ion-photo-crop-modal/ion-photo-crop-modal'


@Component({
  selector:    'ion-photo-input',
  templateUrl: 'ion-photo-input.html',
})
export class IonPhotoInputComponent {

  @ViewChild('inputFile') input: ElementRef
  @Output() onEvent: EventEmitter<any> = new EventEmitter()

  cordova: boolean   = false
  _eventName: string = 'imagecapture'

  constructor(private photoService: IonPhotoService,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController,
              private platform: Platform,
              private render: Renderer,
              private events: Events) {
    this.cordova = this.platform.is('cordova')
    this.events.subscribe(this._eventName, _imageCroped => this.onEvent.emit(_imageCroped))
  }

  openCapture() {
    if (this.cordova) {
        this.photoService.open()
        .then(image => {
            this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
        })
        //.then(image => this.cropImage(image))
        .catch(error => this.toast(error))
    } else {
      this.render.invokeElementMethod(this.input.nativeElement, 'click')
    }

  }

  toast(message: string, duration: number = 3000, position: string = 'top') {
    console.log('toast', message)
    return this.toastCtrl.create({
      message:  message,
      duration: duration,
      position: position,
    }).present()
  }

  cropImage(image: any) {
    this.modalCtrl.create(IonPhotoCropModal, {base64: image, eventName: this._eventName}).present()
  }

  onChange(event) {
    let files  = event.srcElement.files
    let image  = files[0]
    let reader = new FileReader()
    if (image) {
      reader.onload = (evt) => {
        if (evt) {
          let image = evt.srcElement['result']
          //this.cropImage(image)
          this.modalCtrl.create('NativeCameraModalPage', { eventName: this._eventName, image: image }).present();
        }
      }
      reader.readAsDataURL(image)
    }
  }

}
