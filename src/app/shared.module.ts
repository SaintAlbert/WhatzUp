import { Components, Directives, Modules, Pipes } from './app.imports'
import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'
import { CommonModule } from '@angular/common'
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  imports:      [
    CommonModule,
      IonicModule,
      ...Modules,
  ],
  declarations: [
    ...Pipes,
    ...Directives,
    ...Components,
  ],
  exports:      [
    ...Pipes,
    ...Components,
    ...Modules,
      SuperTabsModule,
  ],
})

export class SharedLazyModule {
}
