import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {LanguageModalPage} from "./language-modal";

@NgModule({
  declarations: [
    LanguageModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(LanguageModalPage),
    SharedLazyModule,
  ],
  exports     : [
    LanguageModalPage
  ]
})
export class LanguageModalPageModule {
}
