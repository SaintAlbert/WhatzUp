import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalUpcomingPost } from './modal-post-upcoming';
import {SharedLazyModule} from "../../app/shared.module";

@NgModule({
  declarations: [
      ModalUpcomingPost,
  ],
  imports: [
      IonicPageModule.forChild(ModalUpcomingPost),
      SharedLazyModule,
  ],
  exports: [
      ModalUpcomingPost
  ]
})
export class ModalPostModule {}
