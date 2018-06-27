import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabActivityPage} from "./tab-activity";

@NgModule({
  declarations: [
    TabActivityPage,
  ],
  imports     : [
    IonicPageModule.forChild(TabActivityPage),
    SharedLazyModule,
  ],
  exports     : [
    TabActivityPage
  ]
})
export class TabActivityPageModule {
}
