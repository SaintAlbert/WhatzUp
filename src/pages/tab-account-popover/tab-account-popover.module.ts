import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabAccountPopoverPage} from "./tab-account-popover";

@NgModule({
  declarations: [
    TabAccountPopoverPage,
  ],
  imports     : [
    IonicPageModule.forChild(TabAccountPopoverPage),
    SharedLazyModule,
  ],
  exports     : [
    TabAccountPopoverPage
  ]
})
export class TabAccountPopoverPageModule {
}
