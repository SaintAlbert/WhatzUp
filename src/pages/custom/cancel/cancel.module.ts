
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Cancel } from './cancel';
import { SharedLazyModule } from "../../../app/shared.module";

@NgModule({
  declarations: [
    Cancel,
  ],
  imports: [
      IonicPageModule.forChild(Cancel),
      SharedLazyModule,
  ],
  exports: [
    Cancel
  ]
})
export class CancelModule {}
