import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {IntroPage} from "./intro";

@NgModule({
  declarations: [
    IntroPage,
  ],
  imports     : [
    IonicPageModule.forChild(IntroPage),
    SharedLazyModule,
  ],
  exports     : [
    IntroPage
  ]
})
export class IntroPageModule{
}
