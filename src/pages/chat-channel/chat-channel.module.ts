import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ChatChannelPage} from "./chat-channel";

@NgModule({
  declarations: [
    ChatChannelPage,
  ],
  imports     : [
    IonicPageModule.forChild(ChatChannelPage),
    SharedLazyModule,
  ],
  exports     : [
    ChatChannelPage
  ]
})
export class ChatChannelPageModule{
}
