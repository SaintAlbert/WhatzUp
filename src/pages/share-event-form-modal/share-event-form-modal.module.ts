import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {ShareEventFormModal} from "./share-event-form-modal";

@NgModule({
  declarations: [
      ShareEventFormModal,
  ],
  imports     : [
      IonicPageModule.forChild(ShareEventFormModal),
    SharedLazyModule,
  ],
  exports     : [
      ShareEventFormModal
  ]
})
export class ShareEventFormModalPageModule {
}
