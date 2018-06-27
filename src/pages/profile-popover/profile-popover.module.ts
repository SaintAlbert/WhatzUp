import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ProfilePopoverPage} from "./profile-popover";

@NgModule({
  declarations: [
    ProfilePopoverPage,
  ],
  imports     : [
    IonicPageModule.forChild(ProfilePopoverPage),
    SharedLazyModule,
  ],
  exports     : [
    ProfilePopoverPage
  ]
})
export class ProfilePopoverPageModule{
}
