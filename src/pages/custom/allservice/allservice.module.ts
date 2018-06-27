import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Allservice} from './allservice';
import { SharedLazyModule } from "../../../app/shared.module";

@NgModule({
  declarations: [
    Allservice,
  ],
  imports: [
      IonicPageModule.forChild(Allservice),
      SharedLazyModule,
  ],
  exports: [
    Allservice
  ]
})
export class AllserviceModule {}
