import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { SharedLazyModule } from "../../../app/shared.module";

@NgModule({
  declarations: [
    Chat,
  ],
  imports: [
      IonicPageModule.forChild(Chat),
      SharedLazyModule,
  ],
  exports: [
    Chat
  ]
})
export class ChatModule {}
