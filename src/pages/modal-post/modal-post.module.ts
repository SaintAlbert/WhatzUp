import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPost } from './modal-post';
import {SharedLazyModule} from "../../app/shared.module";

@NgModule({
  declarations: [
    ModalPost,
  ],
  imports: [
      IonicPageModule.forChild(ModalPost),
      SharedLazyModule,
  ],
  exports: [
    ModalPost
  ]
})
export class ModalPostModule {}
