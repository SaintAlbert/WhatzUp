import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ProfilePage} from "./profile";

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports     : [
    IonicPageModule.forChild(ProfilePage),
    SharedLazyModule,
  ],
  exports     : [
    ProfilePage
  ]
})
export class ProfilePageModule{
}
