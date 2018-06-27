import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceDetail} from './servicedetail';
import { SharedLazyModule } from "../../../app/shared.module";

@NgModule({
  declarations: [
      ServiceDetail,
  ],
  imports: [
      IonicPageModule.forChild(ServiceDetail),
      SharedLazyModule,
  ],
  exports: [
      ServiceDetail
  ]
})
export class AllserviceModule {}
