import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoPopoverPage} from "./photo-popover";

@NgModule({
  declarations: [
    PhotoPopoverPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhotoPopoverPage),
    SharedLazyModule,
  ],
  exports     : [
    PhotoPopoverPage
  ]
})
export class PhotoPopoverPageModule{
}
