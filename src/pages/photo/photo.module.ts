import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoPage} from "./photo";

@NgModule({
  declarations: [
    PhotoPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhotoPage),
    SharedLazyModule,
  ],
  exports     : [
    PhotoPage
  ]
})
export class PhotoPageModule{
}
