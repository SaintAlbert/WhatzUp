import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {LocationModalComponent} from "./location-modal";

@NgModule({
  declarations: [
    LocationModalComponent,
  ],
  imports     : [
    IonicPageModule.forChild(LocationModalComponent),
    SharedLazyModule,
  ],
  exports     : [
    LocationModalComponent
  ]
})
export class LocationModalComponentModule{
}
