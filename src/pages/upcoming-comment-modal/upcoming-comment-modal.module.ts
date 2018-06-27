import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {UpcomingCommentModalPage} from "./upcoming-comment-modal";

@NgModule({
  declarations: [
      UpcomingCommentModalPage,
  ],
  imports     : [
      IonicPageModule.forChild(UpcomingCommentModalPage),
    SharedLazyModule,
  ],
  exports     : [
      UpcomingCommentModalPage
  ]
})
export class UpcomingCommentModalPageModue{
}
