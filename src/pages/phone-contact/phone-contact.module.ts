import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {PhoneContactPage} from "./phone-contact";

@NgModule({
  declarations: [
    PhoneContactPage,
  ],
  imports     : [
    IonicPageModule.forChild(PhoneContactPage),
    SharedLazyModule,
  ],
  exports     : [
    PhoneContactPage
  ]
})
export class PhoneContactPageModule{
}
