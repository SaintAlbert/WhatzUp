import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {UpcomingCardModalPage} from "./upcoming-card-modal";

@NgModule({
  declarations: [
      UpcomingCardModalPage,
  ],
  imports     : [
      IonicPageModule.forChild(UpcomingCardModalPage),
    SharedLazyModule,
  ],
  exports     : [
      UpcomingCardModalPage
  ]
})
export class AlbumFormModalPageModule {
}
