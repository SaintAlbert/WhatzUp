import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {CameraPopoverPage} from "./camera-popover";

@NgModule({
  declarations: [
      CameraPopoverPage,
  ],
  imports     : [
      IonicPageModule.forChild(CameraPopoverPage),
    SharedLazyModule,
  ],
  exports     : [
      CameraPopoverPage
  ]
})
export class PhotoListPopoverPageModule{
}
