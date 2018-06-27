/// <reference path="../../../../app/shared.module.ts" />
import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../../../app/shared.module";
import {AuthAvatarPage} from "./auth-avatar";

@NgModule({
  declarations: [
    AuthAvatarPage,
  ],
  imports     : [
    IonicPageModule.forChild(AuthAvatarPage),
    SharedLazyModule,
  ],
  exports     : [
    AuthAvatarPage
  ]
})
export class AuthAvatarPageModule {
}
