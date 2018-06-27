
//import { ComponentsModule } from '../../components/components.module';
import { SharedLazyModule } from "../../../app/shared.module";
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home } from './home';

@NgModule({
  declarations: [
    Home,
  ],
  imports: [
    IonicPageModule.forChild(Home),
    SharedLazyModule,
  ],
  exports: [
    Home
  ]
})
export class HomeModule {}
