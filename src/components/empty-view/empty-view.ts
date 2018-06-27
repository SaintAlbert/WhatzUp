import {Component, Input} from "@angular/core";

@Component({
  selector   : 'empty-view',
  templateUrl: 'empty-view.html'
})
export class EmptyViewComponent {

  @Input() text: string = '';
  @Input() icon: string;
  @Input() logo: string;
  @Input() desc: string = '';

  constructor() {}

}
