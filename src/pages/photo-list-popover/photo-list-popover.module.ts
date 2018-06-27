import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoListPopoverPage} from "./photo-list-popover";

@NgModule({
  declarations: [
    PhotoListPopoverPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhotoListPopoverPage),
    SharedLazyModule,
  ],
  exports     : [
    PhotoListPopoverPage
  ]
})
export class PhotoListPopoverPageModule{
}
