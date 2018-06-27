
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Wizardpopover } from './wizardpopover';

@NgModule({
  declarations: [
    Wizardpopover,
  ],
  imports: [
    IonicPageModule.forChild(Wizardpopover),
  ],
  exports: [
    Wizardpopover
  ]
})
export class WizardpopoverModule {}
