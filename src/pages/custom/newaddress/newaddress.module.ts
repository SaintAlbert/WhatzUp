import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Newaddress } from './newaddress';

@NgModule({
  declarations: [
    Newaddress,
  ],
  imports: [
    IonicPageModule.forChild(Newaddress),
  ],
  exports: [
    Newaddress
  ]
})
export class NewaddressModule {}
