//import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Myproject } from './myproject';
import {SharedLazyModule} from "../../../app/shared.module";

@NgModule({
  declarations: [
    Myproject,
  ],
  imports: [
    IonicPageModule.forChild(Myproject),
      SharedLazyModule
  ],
  exports: [
    Myproject
  ]
})
export class MyprojectPageModule {}
