import { NgModule } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { IonicModule } from 'ionic-angular'
// Components
import { IonPhotoCropModal } from './ion-photo-crop-modal/ion-photo-crop-modal'
import { IonPhotoService } from './ion-photo-service'
import { IonPhotoCanvasService } from './ion-photo-canvas-service'
import { ImageCaptureComponent } from './image-capture/image-capture'
import { ImgProgressiveComponent } from './img-progressive/img-progressive'
import { IonPhotoInputComponent } from './ion-photo-input/ion-photo-input'
import { UploadStatusComponent } from './upload-status/upload-status'

export const APP_COMPONENTS = [
  IonPhotoCropModal,
  IonPhotoInputComponent,
  ImageCaptureComponent,
  ImgProgressiveComponent,
  UploadStatusComponent,
]

@NgModule({
  imports:         [
    IonicModule,
    TranslateModule,
  ],
  exports:         [APP_COMPONENTS],
  declarations:    [APP_COMPONENTS],
  entryComponents: [APP_COMPONENTS],
  providers:       [
      IonPhotoService,
      IonPhotoCanvasService,
  ],
})

export class IonPhotoModule {
}
