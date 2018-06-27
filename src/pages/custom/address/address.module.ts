import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Address } from './address';
import { SharedLazyModule } from "../../../app/shared.module";

@NgModule({
  declarations: [
    Address,
  ],
  imports: [
      IonicPageModule.forChild(Address),
      SharedLazyModule,
  ],
  exports: [
    Address
  ]
})
export class AddressModule {}
