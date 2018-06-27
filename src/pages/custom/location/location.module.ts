
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Location } from './location';
import { SharedLazyModule } from "../../../app/shared.module";
@NgModule({
  declarations: [
    Location,
  ],
  imports: [
    IonicPageModule.forChild(Location),
    SharedLazyModule,
  ],
  exports: [
    Location
  ]
})
export class LocationModule {}
