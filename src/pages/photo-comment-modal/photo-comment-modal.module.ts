import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhotoCommentModalPage} from "./photo-comment-modal";

@NgModule({
  declarations: [
    PhotoCommentModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhotoCommentModalPage),
    SharedLazyModule,
  ],
  exports     : [
    PhotoCommentModalPage
  ]
})
export class PhotoCommentModalPageModue{
}
