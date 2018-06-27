import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Recommended } from './recommended';

@NgModule({
  declarations: [
    Recommended,
  ],
  imports: [
    IonicPageModule.forChild(Recommended),
  ],
  exports: [
    Recommended
  ]
})
export class RecommendedModule {}
