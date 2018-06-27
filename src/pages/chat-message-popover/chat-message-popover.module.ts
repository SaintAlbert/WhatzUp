import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ChatMessagePopoverPage} from "./chat-message-popover";

@NgModule({
  declarations: [
    ChatMessagePopoverPage,
  ],
  imports     : [
    IonicPageModule.forChild(ChatMessagePopoverPage),
    SharedLazyModule,
  ],
  exports     : [
    ChatMessagePopoverPage
  ]
})
export class ChatMessagePopoverPageModule{
}
