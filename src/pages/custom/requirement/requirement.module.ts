
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Requirement } from './requirement';

@NgModule({
  declarations: [
    Requirement,
  ],
  imports: [
    IonicPageModule.forChild(Requirement),
  ],
  exports: [
    Requirement
  ]
})
export class RequirementModule {}
