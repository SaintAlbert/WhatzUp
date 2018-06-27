import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SharedLazyModule} from "../../app/shared.module";
import {CategoryPage} from "./category";

@NgModule({
  declarations: [
      CategoryPage,
  ],
  imports     : [
      IonicPageModule.forChild(CategoryPage),
    SharedLazyModule,
  ],
  exports     : [
      CategoryPage
  ]
})
export class CategoryPageModule {
}
