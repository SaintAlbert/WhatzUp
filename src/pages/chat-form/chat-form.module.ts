import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ChatFormPage} from "./chat-form";

@NgModule({
  declarations: [
    ChatFormPage,
  ],
  imports     : [
    IonicPageModule.forChild(ChatFormPage),
    SharedLazyModule,
  ],
  exports     : [
    ChatFormPage
  ]
})
export class ChatFormPageModule{
}
