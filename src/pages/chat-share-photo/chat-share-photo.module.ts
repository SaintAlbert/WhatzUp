import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ChatSharePhotoPage} from "./chat-share-photo";

@NgModule({
  declarations: [
    ChatSharePhotoPage,
  ],
  imports     : [
    IonicPageModule.forChild(ChatSharePhotoPage),
    SharedLazyModule,
  ],
  exports     : [
    ChatSharePhotoPage
  ]
})
export class ChatSharePhotoPageModule{
}
