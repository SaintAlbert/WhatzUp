import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoShareEventModalPage} from "./photo-share-event-modal";

@NgModule({
  declarations: [
      PhotoShareEventModalPage,
  ],
  imports     : [
      IonicPageModule.forChild(PhotoShareEventModalPage),
    SharedLazyModule,
  ],
  exports     : [
      PhotoShareEventModalPage
  ]
})
export class PhotoShareEventModalPageModule{
}
