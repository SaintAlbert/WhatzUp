import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {AboutPage} from "./about";

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports     : [
    IonicPageModule.forChild(AboutPage),
    SharedLazyModule,
  ],
  exports     : [
    AboutPage
  ]
})
export class AboutPageModule {
}
