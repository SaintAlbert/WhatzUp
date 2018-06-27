import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {NativeCameraModalPage} from "./native-cameral-modal";

@NgModule({
  declarations: [
      NativeCameraModalPage,
  ],
  imports     : [
      IonicPageModule.forChild(NativeCameraModalPage),
    SharedLazyModule,
  ],
  exports     : [
      NativeCameraModalPage
  ]
})
export class NativeCameraModalPageModule {
}
