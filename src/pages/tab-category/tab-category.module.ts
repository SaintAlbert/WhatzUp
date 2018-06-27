import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabCategoryPage } from './tab-category';
import {SharedLazyModule} from "../../app/shared.module";

@NgModule({
  declarations: [
    TabCategoryPage,
  ],
  imports: [
      IonicPageModule.forChild(TabCategoryPage),
      SharedLazyModule,
  ],
    exports: [
        TabCategoryPage
    ]
})
export class TabCategoryPageModule {}
