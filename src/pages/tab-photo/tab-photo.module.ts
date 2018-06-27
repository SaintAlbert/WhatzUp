import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabPhotoPage } from './tab-photo';
import {SharedLazyModule} from "../../app/shared.module";

@NgModule({
  declarations: [
      TabPhotoPage,
  ],
  imports: [
      IonicPageModule.forChild(TabPhotoPage),
      SharedLazyModule,
  ],
    exports: [
        TabPhotoPage
    ]
})
export class TabPhotoPageModule {}
