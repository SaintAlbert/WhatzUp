import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HandyBooking } from './handybooking';
import {SharedLazyModule} from "../../../app/shared.module";

@NgModule({
  declarations: [
      HandyBooking,
  ],
  imports: [
      IonicPageModule.forChild(HandyBooking),
      SharedLazyModule
  ],
  exports: [
      HandyBooking
  ]
})
export class handybookingModule {}
