import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../../app/shared.module";
import {HandyCommentModalPage} from "./handy-comment-modal";

@NgModule({
  declarations: [
      HandyCommentModalPage,
  ],
  imports     : [
      IonicPageModule.forChild(HandyCommentModalPage),
    SharedLazyModule,
  ],
  exports     : [
      HandyCommentModalPage
  ]
})
export class HandyCommentModalPageModue{
}
