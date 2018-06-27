import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {CameraldModalPage} from "./cameral-modal";

@NgModule({
  declarations: [
      CameraldModalPage,
  ],
  imports     : [
      IonicPageModule.forChild(CameraldModalPage),
    SharedLazyModule,
  ],
  exports     : [
      CameraldModalPage
  ]
})
export class AlbumFormModalPageModule {
}
