/// <reference path="permissions.ts" />
import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PermissionsPage} from "./permissions";

@NgModule({
  declarations: [
      PermissionsPage,
  ],
  imports     : [
      IonicPageModule.forChild(PermissionsPage),
    SharedLazyModule,
  ],
  exports     : [
      PermissionsPage
  ]
})
export class PermissionsPageModalPageModule{
}
