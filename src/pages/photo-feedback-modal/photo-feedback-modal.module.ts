import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoFeedbackModalPage} from "./photo-feedback-modal";

@NgModule({
  declarations: [
    PhotoFeedbackModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhotoFeedbackModalPage),
    SharedLazyModule,
  ],
  exports     : [
    PhotoFeedbackModalPage
  ]
})
export class PhotoFeedbackModalPageModule{
}
