import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {FacebookUserListPage} from "./facebook-user-list";

@NgModule({
  declarations: [
    FacebookUserListPage,
  ],
  imports     : [
    IonicPageModule.forChild(FacebookUserListPage),
    SharedLazyModule,
  ],
  exports     : [
    FacebookUserListPage
  ]
})
export class FacebookUserListPageModule{
}
