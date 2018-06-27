import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {AlbumListModalPage} from "./album-list-modal";

@NgModule({
  declarations: [
    AlbumListModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(AlbumListModalPage),
    SharedLazyModule,
  ],
  exports     : [
    AlbumListModalPage
  ]
})
export class AlbumListModalPageModule {
}
