import {Component, Input, OnInit} from "@angular/core";
import {App, Events, NavController} from "ionic-angular";

// Extra
import { postCategory } from '../../config'

/**
 * Generated class for the CategoryComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'category-list',
  templateUrl: 'category.html'
})
export class CategoryComponent {

   
    postCategory: any = postCategory;

    constructor(private navCtrl: NavController, private app: App) {
    console.log('Hello CategoryComponent Component');
 
    }

  onSelectCategory(category: string) {
      //this.navCtrl.push('CategoryPage', { category: category })
      this.app.getRootNav().push('CategoryPage', { category: category })
    }

 

  onSelectCountryCategory(country_city: string, type: any) {
      this.app.getRootNav().push('CategoryPage', { country_city: country_city, type: type });
      //this.navCtrl.push('CategoryPage', { country_city: country_city, type: type })
  }

}
