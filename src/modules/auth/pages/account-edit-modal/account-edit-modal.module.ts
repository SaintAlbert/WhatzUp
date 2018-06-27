import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../../../app/shared.module";
import {AccountEditModalPage} from "./account-edit-modal";

@NgModule({
  declarations: [
    AccountEditModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(AccountEditModalPage),
    SharedLazyModule,
  ],
  exports     : [
    AccountEditModalPage
  ]
})
export class AccountEditModalPageModule {
}
