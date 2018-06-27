import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {AlbumFormModalPage} from "./album-form-modal";

@NgModule({
  declarations: [
    AlbumFormModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(AlbumFormModalPage),
    SharedLazyModule,
  ],
  exports     : [
    AlbumFormModalPage
  ]
})
export class AlbumFormModalPageModule {
}
