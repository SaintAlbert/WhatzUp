import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabCapturePage} from "./tab-capture";

@NgModule({
  declarations: [
    TabCapturePage,
  ],
  imports     : [
    IonicPageModule.forChild(TabCapturePage),
    SharedLazyModule,
  ],
  exports     : [
    TabCapturePage
  ]
})
export class TabCapturePageModule {
}
