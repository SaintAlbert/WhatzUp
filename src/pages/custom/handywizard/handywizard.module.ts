
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HandyAppointmentwizard } from './handywizard';
import {SharedLazyModule} from "../../../app/shared.module";



@NgModule({
  declarations: [
      HandyAppointmentwizard,
  ],
  imports: [
      IonicPageModule.forChild(HandyAppointmentwizard),
      SharedLazyModule,
  ],
  exports: [
      HandyAppointmentwizard
  ]
})
export class FitnesswizardModule {}
