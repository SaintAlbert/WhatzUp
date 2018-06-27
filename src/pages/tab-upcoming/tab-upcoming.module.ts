import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabUpcomingPage } from './tab-upcoming';
import {SharedLazyModule} from "../../app/shared.module";
@NgModule({
  declarations: [
    TabUpcomingPage,
  ],
  imports: [
      IonicPageModule.forChild(TabUpcomingPage),
      SharedLazyModule,
  ],
  exports: [
      TabUpcomingPage
  ]
})
export class TabUpcomingPageModule {}
