import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoEditPage} from "./photo-edit";

@NgModule({
  declarations: [
    PhotoEditPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhotoEditPage),
    SharedLazyModule,
  ],
  exports     : [
    PhotoEditPage
  ]
})
export class PhotoEditPageModule{
}
