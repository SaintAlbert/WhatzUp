//import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Message } from './message';
import {SharedLazyModule} from "../../../app/shared.module";

@NgModule({
  declarations: [
    Message,
  ],
  imports: [
    IonicPageModule.forChild(Message),
      SharedLazyModule
  ],
  exports: [
    Message
  ]
})
export class MessageModule {}
