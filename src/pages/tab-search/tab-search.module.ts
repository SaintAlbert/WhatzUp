import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabSearchPage} from "./tab-search";

@NgModule({
  declarations: [
    TabSearchPage,
  ],
  imports     : [
    IonicPageModule.forChild(TabSearchPage),
    SharedLazyModule,
  ],
  exports     : [
    TabSearchPage
  ]
})
export class TabSearchPageModule {
}
