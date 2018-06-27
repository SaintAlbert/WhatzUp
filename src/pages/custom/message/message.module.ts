//import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Message } from './message';

@NgModule({
  declarations: [
    Message,
  ],
  imports: [
    IonicPageModule.forChild(Message),
	//ComponentsModule
  ],
  exports: [
    Message
  ]
})
export class MessageModule {}
