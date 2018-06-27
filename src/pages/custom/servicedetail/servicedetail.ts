import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, ViewController, Content, Slides, NavParams } from 'ionic-angular';
import { handy, handycategory, EnumPackageItem } from "../../../handyman-config";

@IonicPage()
@Component({
    selector: 'page-allservice',
    templateUrl: 'servicedetail.html',
})
export class ServiceDetail {

    showPrev: any;
    showNext: any;
    currentIndex: any;

    @ViewChild(Content) content: Content;
    // @ViewChild('mySlider') slider: Slides;
    service: any = ""
    serviceItems: any = []
    serviceItem: any;
    slidertab: any;
    id: any
    selectedIndex: any

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController) {
        this.id = this.navParams.get("id");
        this.selectedIndex = this.navParams.get("index");
        //this.slidertab = selectedIndex;
        this.service = handy[this.id];
        this.serviceItem = handycategory[this.id].item[this.selectedIndex];
        //console.log( this.service)
        //console.log(this.serviceItems)
        //console.log(this.serviceItem)
        //for testing
       this.constructSampleData();
        //this.serviceItems =
        


        //console.log("id", id);
        //setTimeout(() => {
        //    this.goToSlide(id);
        //}, 500)

    }

    constructSampleData() {
     
        let serviceItem1 = handycategory[this.id].item[this.selectedIndex];
        serviceItem1.packageList.push({
            label: 'Monthly Wax and Groom',
            desc: [' Waxing ( Full Legs, Arms, Under Arms )', '+ Threading ( Full Face )'],
            price: 50, symbol: '£', code: 'GBP', min: '50min'
        });
        this.serviceItems.push(serviceItem1);

        
        //let serviceItem2 = handycategory[this.id].item[this.selectedIndex];
        //serviceItem2.packageList.push({
        //    label: 'Monthly Wax and Groom',
        //    desc: [' Waxing ( Full Legs, Arms, Under Arms )', '+ Threading ( Full Face )'],
        //    price: 50, symbol: '£', code: 'GBP', min: '50min'
        //});
        //this.serviceItems.push(serviceItem2);

        
        //let serviceItem3 = handycategory[this.id].item[this.selectedIndex];
        //serviceItem3.packageList.push({
        //    label: 'Monthly Wax and Groom',
        //    desc: [' Waxing ( Full Legs, Arms, Under Arms )', '+ Threading ( Full Face )'],
        //    price: 50, symbol: '£', code: 'GBP', min: '50min'
        //});
        //this.serviceItems.push(serviceItem3);

        
        //let serviceItem4 = handycategory[this.id].item[this.selectedIndex];
        //serviceItem4.packageList.push({
        //    label: 'Monthly Wax and Groom',
        //    desc: [' Waxing ( Full Legs, Arms, Under Arms )', '+ Threading ( Full Face )'],
        //    price: 50, symbol: '£', code: 'GBP', min: '50min'
        //});
        //this.serviceItems.push(serviceItem4);

       
        //let serviceItem5 = handycategory[this.id].item[this.selectedIndex];
        //serviceItem5.packageList.push({
        //    label: 'Monthly Wax and Groom',
        //    desc: [' Waxing ( Full Legs, Arms, Under Arms )', '+ Threading ( Full Face )'],
        //    price: 50, symbol: '£', code: 'GBP', min: '50min'
        //});
        //this.serviceItems.push(serviceItem5);


        console.log(this.serviceItems)
    }

    getCode(code: string) {
        //console.log(code)
        return code.trim();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad Allservice');
    }


    goBack() {
        this.navCtrl.pop();
    }


    summary() {
        this.navCtrl.push('Summary');
    }

    add(s) {
        let modal = this.modalCtrl.create('Addpopup', { serviceItem:s});
        modal.present();
    }


}
