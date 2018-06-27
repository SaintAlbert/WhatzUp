import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../../../app/shared.module";
import {AuthRegisterPage} from "./auth-register";

@NgModule({
  declarations: [
    AuthRegisterPage,
  ],
  imports     : [
    IonicPageModule.forChild(AuthRegisterPage),
    SharedLazyModule,
  ],
  exports     : [
    AuthRegisterPage
  ]
})
export class AuthRegisterPageModule{
}
