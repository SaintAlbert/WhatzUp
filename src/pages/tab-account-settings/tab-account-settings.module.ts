import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TabAccountSettingsPage} from "./tab-account-settings";

@NgModule({
  declarations: [
    TabAccountSettingsPage,
  ],
  imports     : [
    IonicPageModule.forChild(TabAccountSettingsPage),
    SharedLazyModule,
  ],
  exports     : [
    TabAccountSettingsPage
  ]
})
export class TabAccountSettingsPageModule {
}
