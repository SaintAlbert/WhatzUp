import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ChatMessagePage} from "./chat-message";
import { AutosizeDirective } from '../../directives/autosize/autosize'

@NgModule({
  declarations: [
      ChatMessagePage,
    
  ],
  imports     : [
    IonicPageModule.forChild(ChatMessagePage),
      SharedLazyModule
  ],
  exports     : [
      ChatMessagePage
  ]
})
export class ChatMessagePageModule{
}
