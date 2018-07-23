import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../../app/shared.module";
import {HandyManShareModalPage} from "./handy-share-modal";

@NgModule({
  declarations: [
      HandyManShareModalPage,
  ],
  imports     : [
      IonicPageModule.forChild(HandyManShareModalPage),
    SharedLazyModule,
  ],
  exports     : [
      HandyManShareModalPage
  ]
})
export class HandyShareModalPageModule{
}
