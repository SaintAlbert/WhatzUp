import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {LiveShowPage} from "./live-show";

@NgModule({
  declarations: [
      LiveShowPage,
  ],
  imports     : [
      IonicPageModule.forChild(LiveShowPage),
    SharedLazyModule,
  ],
  exports     : [
      LiveShowPage
  ]
})
export class LiveShowPageModule{
}
