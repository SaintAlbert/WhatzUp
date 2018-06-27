import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {AlbumPhotoGridPage} from "./album-photo-grid";


@NgModule({
  declarations: [
    AlbumPhotoGridPage,
  ],
  imports     : [
    IonicPageModule.forChild(AlbumPhotoGridPage),
    SharedLazyModule,
  ],
  exports     : [
    AlbumPhotoGridPage
  ]
})
export class AlbumPhotoGridPageModule{
}
