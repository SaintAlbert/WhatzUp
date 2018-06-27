import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../../../app/shared.module";
import {AuthLoginPage} from "./auth-login";

@NgModule({
  declarations: [
    AuthLoginPage,
  ],
  imports     : [
    IonicPageModule.forChild(AuthLoginPage),
    SharedLazyModule,
  ],
  exports     : [
    AuthLoginPage
  ]
})
export class AuthLoginPageModule {
}
