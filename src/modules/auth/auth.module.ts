import { NgModule } from '@angular/core'
import { IonicModule } from 'ionic-angular'
import { TranslateModule } from '@ngx-translate/core'
import { ButtonFacebookLoginComponent } from './components/button-facebook-login/button-facebook-login'

const APP_COMPONENTS = [
  ButtonFacebookLoginComponent,
]
@NgModule({
  imports:         [
    IonicModule,
    TranslateModule,
  ],
  exports:         [APP_COMPONENTS],
  declarations:    [APP_COMPONENTS],
  entryComponents: [APP_COMPONENTS],
  providers:       [],
})

export class AuthModule {
}
