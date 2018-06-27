import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Projectlist } from './projectlist';

@NgModule({
  declarations: [
    Projectlist,
  ],
  imports: [
    IonicPageModule.forChild(Projectlist),
  ],
  exports: [
    Projectlist
  ]
})
export class ProjectlistModule {}
