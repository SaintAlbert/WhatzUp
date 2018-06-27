import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {UpcomingListPopoverPage} from "./upcoming-list-popover";

@NgModule({
  declarations: [
      UpcomingListPopoverPage,
  ],
  imports     : [
      IonicPageModule.forChild(UpcomingListPopoverPage),
    SharedLazyModule,
  ],
  exports     : [
      UpcomingListPopoverPage
  ]
})
export class UpcomingListPopoverPageModule{
}
