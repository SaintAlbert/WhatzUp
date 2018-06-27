
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Wizardsuccess } from './wizardsuccess';

@NgModule({
  declarations: [
    Wizardsuccess,
  ],
  imports: [
    IonicPageModule.forChild(Wizardsuccess),
  ],
  exports: [
    Wizardsuccess
  ]
})
export class WizardsuccessModule {}
