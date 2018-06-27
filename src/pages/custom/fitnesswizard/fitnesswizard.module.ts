
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Fitnesswizard } from './fitnesswizard';

@NgModule({
  declarations: [
    Fitnesswizard,
  ],
  imports: [
    IonicPageModule.forChild(Fitnesswizard),
  ],
  exports: [
    Fitnesswizard
  ]
})
export class FitnesswizardModule {}
