
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Fitness } from './fitness';

@NgModule({
  declarations: [
    Fitness,
  ],
  imports: [
    IonicPageModule.forChild(Fitness),
  ],
  exports: [
    Fitness
  ]
})
export class FitnessModule {}
