import {Component, Input} from "@angular/core";
import { Events} from "ionic-angular";

import Parse from "parse";

@Component({
    selector: 'photo-filter',
    templateUrl: 'photo-filter.html'
})
export class PhotoFilterComponent {

  @Input() item: any=[];

  constructor(private events: Events,
              //public imageViewerCtrl: ImageViewerController
         
  ) {
   
  }

}
