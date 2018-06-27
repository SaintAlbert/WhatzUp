import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PriceModalComponent} from "./price-modal";

@NgModule({
  declarations: [
      PriceModalComponent,
  ],
  imports     : [
      IonicPageModule.forChild(PriceModalComponent),
    SharedLazyModule,
  ],
  exports     : [
      PriceModalComponent
  ]
})
export class PriceModalComponentModule{
}
