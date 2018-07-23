import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalMerchant } from './modal-merchant';
import {SharedLazyModule} from "../../../app/shared.module";

@NgModule({
  declarations: [
      ModalMerchant,
  ],
  imports: [
      IonicPageModule.forChild(ModalMerchant),
      SharedLazyModule,
  ],
  exports: [
      ModalMerchant
  ]
})
export class ModalPostModule {}
