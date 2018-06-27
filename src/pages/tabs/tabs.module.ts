import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabsPage} from "./tabs";



@NgModule({
  declarations: [
    TabsPage,
  ],
  imports     : [
    IonicPageModule.forChild(TabsPage),
      SharedLazyModule,
     
  ],
  exports     : [
    TabsPage
  ]
})
export class TabsPageModule {
}
