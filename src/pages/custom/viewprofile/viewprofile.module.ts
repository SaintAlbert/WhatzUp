import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Viewprofile } from './viewprofile';

@NgModule({
  declarations: [
    Viewprofile,
  ],
  imports: [
    IonicPageModule.forChild(Viewprofile),
  ],
  exports: [
    Viewprofile
  ]
})
export class ViewprofileModule {}
