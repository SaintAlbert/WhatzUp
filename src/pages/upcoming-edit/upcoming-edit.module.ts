import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {UpcomingEditPage} from "./upcoming-edit";

@NgModule({
  declarations: [
      UpcomingEditPage,
  ],
  imports     : [
      IonicPageModule.forChild(UpcomingEditPage),
    SharedLazyModule,
  ],
  exports     : [
      UpcomingEditPage
  ]
})
export class UpcomingEditPageModule{
}
