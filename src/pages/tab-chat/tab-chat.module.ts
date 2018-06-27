import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabChatPage} from "./tab-chat";

@NgModule({
  declarations: [
      TabChatPage,
  ],
  imports     : [
      IonicPageModule.forChild(TabChatPage),
    SharedLazyModule,
  ],
  exports     : [
      TabChatPage
  ]
})
export class TabCapturePageModule {
}
