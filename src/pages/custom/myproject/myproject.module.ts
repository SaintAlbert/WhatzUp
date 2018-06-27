//import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Myproject } from './myproject';

@NgModule({
  declarations: [
    Myproject,
  ],
  imports: [
    IonicPageModule.forChild(Myproject),
	//ComponentsModule
  ],
  exports: [
    Myproject
  ]
})
export class MyprojectPageModule {}
