import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Selectaddress } from './selectaddress';

@NgModule({
  declarations: [
    Selectaddress,
  ],
  imports: [
    IonicPageModule.forChild(Selectaddress),
  ],
  exports: [
    Selectaddress
  ]
})
export class SelectaddressModule {}
