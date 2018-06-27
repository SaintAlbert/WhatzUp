import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {UserPasswordPage} from "./user-password";

@NgModule({
  declarations: [
    UserPasswordPage,
  ],
  imports     : [
    IonicPageModule.forChild(UserPasswordPage),
    SharedLazyModule,
  ],
  exports     : [
    UserPasswordPage
  ]
})
export class UserPasswordPageModule {
}
