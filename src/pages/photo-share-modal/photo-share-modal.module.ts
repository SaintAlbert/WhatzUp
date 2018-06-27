import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoShareModalPage} from "./photo-share-modal";

@NgModule({
  declarations: [
    PhotoShareModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhotoShareModalPage),
    SharedLazyModule,
  ],
  exports     : [
    PhotoShareModalPage
  ]
})
export class PhotoShareModalPageModule{
}
