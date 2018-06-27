
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Service } from './service';

@NgModule({
  declarations: [
    Service,
  ],
  imports: [
    IonicPageModule.forChild(Service),
  ],
  exports: [
    Service
  ]
})
export class ServiceModule {}
