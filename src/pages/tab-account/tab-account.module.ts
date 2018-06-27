import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabAccountPage} from "./tab-account";

@NgModule({
  declarations: [
    TabAccountPage,
  ],
  imports     : [
    IonicPageModule.forChild(TabAccountPage),
    SharedLazyModule,
  ],
  exports     : [
    TabAccountPage
  ]
})
export class TabAccountPageModule {
}
