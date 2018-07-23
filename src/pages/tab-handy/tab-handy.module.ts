import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabHandyPage} from "./tab-handy";
//import {ScrollHideDirective} from "../../directives/scrollhideheader/scrollhideheader";

@NgModule({
  declarations: [
      TabHandyPage,
      //ScrollHideDirective,
  ],
  imports     : [
      IonicPageModule.forChild(TabHandyPage),
    SharedLazyModule,
  ],
  exports     : [
      TabHandyPage
  ]
})
export class TabHomePageModule {
}
