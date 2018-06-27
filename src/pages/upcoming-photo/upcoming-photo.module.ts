import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {UpcomingPhotoPage} from "./upcoming-photo";

@NgModule({
  declarations: [
      UpcomingPhotoPage,
  ],
  imports     : [
      IonicPageModule.forChild(UpcomingPhotoPage),
    SharedLazyModule,
  ],
  exports     : [
      UpcomingPhotoPage
  ]
})
export class PhotoPageModule{
}
