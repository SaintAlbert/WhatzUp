import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Addpopup } from './addpopup';
import { SharedLazyModule } from "../../../app/shared.module";

@NgModule({
  declarations: [
    Addpopup,
  ],
  imports: [
      IonicPageModule.forChild(Addpopup),
      SharedLazyModule,
  ],
  exports: [
    Addpopup
  ]
})
export class AddpopupModule {}
