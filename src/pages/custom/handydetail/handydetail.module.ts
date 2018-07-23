import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Handydetail } from './handydetail';
import {SharedLazyModule} from "../../../app/shared.module";

@NgModule({
  declarations: [
      Handydetail,
  ],
  imports: [
      IonicPageModule.forChild(Handydetail),
      SharedLazyModule,
  ],
  exports: [
      Handydetail
  ]
})
export class HandydetailModule {}
