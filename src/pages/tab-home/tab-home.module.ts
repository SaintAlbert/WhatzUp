import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabHomePage} from "./tab-home";
//import {ScrollHideDirective} from "../../directives/scrollhideheader/scrollhideheader";

@NgModule({
  declarations: [
      TabHomePage,
      //ScrollHideDirective,
  ],
  imports     : [
    IonicPageModule.forChild(TabHomePage),
    SharedLazyModule,
  ],
  exports     : [
    TabHomePage
  ]
})
export class TabHomePageModule {
}
