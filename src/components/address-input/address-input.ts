import {Component, Input} from '@angular/core';
import {Events, ModalController} from 'ionic-angular';

@Component({
    selector:    'address-input',
    templateUrl: 'address-input.html'
})
export class AddressInputComponent {

    @Input() address?: any;

    constructor(private events: Events, private modalCtrl: ModalController) {

    }

    showAddressModal() {
        let modal = this.modalCtrl.create('GmapsAutocompleteModalPage');
        modal.onDidDismiss(address => {
            if (address) {
                console.log(address)
                this.address = address;
                this.events.publish('address:selected', address);
            }
        });
        modal.present();
    }

    clearAddress() {
        this.address = {};
    }
}

