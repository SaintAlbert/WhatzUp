import { Injectable } from '@angular/core'
import { Camera } from '@ionic-native/camera'
//import { canvascamera } from '@types/cordova-plugin-canvascamera'
import { ActionSheetController, Platform, Events} from 'ionic-angular'
import { TranslateService } from '@ngx-translate/core'
declare const window: any;

@Injectable()
export class IonPhotoService {
  _base64Image: any
  _cordova: boolean = false
  _setting          = {
    quality:            70,
    width:              640,
    height:             1200,
    saveToPhotoAlbum:   false,
    allowEdit:          false,
    correctOrientation: true,
    allowRotation:      true,
    aspectRatio:        0,
  }
  crop: boolean     = true

  _translateOption: string
  _translateCamera: string
  _translateLibrary: string
  _translateCancel: string
  _translateNotCordova: string

  constructor(private actionSheetCtrl: ActionSheetController,
              private platform: Platform,
              private Camera: Camera,
              private translateService: TranslateService,
              ) {
    this._cordova = this.platform.is('cordova') ? true : false
    // Translate
    this.translate('Photo Option').then(result => this._translateOption = result)
    this.translate('Take Picture').then(result => this._translateCamera = result)
    this.translate('Photo library').then(result => this._translateLibrary = result)
    this.translate('Cancel').then(result => this._translateCancel = result)
    this.translate('Browser not supported').then(result => this._translateNotCordova = result)
}

  translate(text: string): Promise<any> {
    return new Promise(resolve => {
      this.translateService.get(text).subscribe((res: string) => resolve(res))
    })
  }

  open() {
    return new Promise((resolve, reject) => {
      this.actionSheetCtrl.create({
          title: this._translateOption,
          cssClass:'primary',
        buttons: [
          {
            text:    this._translateCamera,
            icon: 'camera',
            cssClass: 'primary',
            handler: () => {
              if (this._cordova) {
                this.camera().then(image => resolve(image)).catch(reject)
              } else {
                reject(this._translateNotCordova)
              }
            },
          },
          {
            text:    this._translateLibrary,
            icon: 'images',
            cssClass: 'primary',
            handler: () => {
              if (this._cordova) {
                this.photoLibrary().then(image => resolve(image)).catch(reject)
              } else {
                reject(this._translateNotCordova)
              }
            },
          },
          {
              text: this._translateCancel,
              cssClass: 'primary',
          },
        ],
      }).present()
    })
  }

  camera() {
    return new Promise((resolve, reject) => {
      let _options = {
        targetWidth:     this._setting.width,
        targetHeight:    this._setting.height,
        quality:         this._setting.quality,
        sourceType:      this.Camera.PictureSourceType.CAMERA,
        destinationType: this.Camera.DestinationType.DATA_URL,
      }

      this.Camera.getPicture(_options).then((imageData) => {
        // imageData is a base64 encoded string
        if (this._cordova) {
          this._base64Image = 'data:image/jpeg;base64,' + imageData
        } else {
          this._base64Image = imageData
        }
        resolve(this._base64Image)
      }, (err) => {
        console.log(err)
        reject(err)
      })
    })
  }

  photoLibrary() {
    return new Promise((resolve, reject) => {
      let _options = {
        targetWidth:        this._setting.width,
        targetHeight:       this._setting.height,
        quality:            this._setting.quality,
        sourceType:         this.Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType:    this.Camera.DestinationType.DATA_URL,
        maximumImagesCount: 1,
      }

      this.Camera.getPicture(_options).then(imageData => {
        // imageData is a base64 encoded string
        if (this._cordova) {
          this._base64Image = 'data:image/jpeg;base64,' + imageData
        } else {
          this._base64Image = imageData
        }
        resolve(this._base64Image)
      }, (err) => {
        console.log(err)
        reject(err)
      })
    })
  }

  openGalaryOnly() {
      return new Promise((resolve, reject) => {
          this.photoLibrary().then(image => resolve(image)).catch(reject)
      })
  }
  openCameraOnly() {
      return new Promise((resolve, reject) => {
          this.camera().then(image => resolve(image)).catch(reject)
      })
  }


}
