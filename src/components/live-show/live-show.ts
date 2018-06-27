import { Component, ViewChild, ElementRef} from '@angular/core';
import { SocketConectionProvider } from '../../providers/socket-conection/socket-conection';
import {UserProvider} from "../../providers/user/user";
/**
 * Generated class for the LiveShowComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'live-show',
  templateUrl: 'live-show.html'
})
export class LiveShowComponent {
    @ViewChild('videoscontainer') videoscontainer: ElementRef;
    @ViewChild('capturespan') capturespan: ElementRef;
    user: any
    socketIOConnection;
    constructor(socketIOConnection: SocketConectionProvider, private User: UserProvider) {
        console.log('Hello LiveShowComponent Component');
        this.user = User.current();
        this.socketIOConnection = socketIOConnection;
        socketIOConnection.videoscontainer = this.videoscontainer;
        socketIOConnection.InitBroadCastConnectionAttach(this.user.id)
    }

    openOrJoin() {
        this.socketIOConnection.openOrJoin(this.user.id,"user")
    }

}
