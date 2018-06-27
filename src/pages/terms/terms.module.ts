import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {TermsPage} from "./terms";

@NgModule({
  declarations: [
    TermsPage,
  ],
  imports     : [
    IonicPageModule.forChild(TermsPage),
    SharedLazyModule,
  ],
  exports     : [
    TermsPage
  ]
})
export class TermsPageModule {
}
