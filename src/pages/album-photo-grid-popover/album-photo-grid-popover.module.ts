import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {AlbumPhotoGridPopoverPage} from "./album-photo-grid-popover";


@NgModule({
  declarations: [
    AlbumPhotoGridPopoverPage,
  ],
  imports     : [
    IonicPageModule.forChild(AlbumPhotoGridPopoverPage),
    SharedLazyModule,
  ],
  exports     : [
    AlbumPhotoGridPopoverPage
  ]
})
export class AlbumPhotoGridPopoverPageModule{
}
