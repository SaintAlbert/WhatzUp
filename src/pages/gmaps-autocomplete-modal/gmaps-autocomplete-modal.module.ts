import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {GmapsAutocompleteModalPage} from "./gmaps-autocomplete-modal";

@NgModule({
  declarations: [
    GmapsAutocompleteModalPage,
  ],
  imports     : [
    IonicPageModule.forChild(GmapsAutocompleteModalPage),
    SharedLazyModule,
  ],
  exports     : [
    GmapsAutocompleteModalPage
  ]
})
export class GmapsAutocompleteModalPageModule{
}
