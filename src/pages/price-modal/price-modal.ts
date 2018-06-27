import {Component, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Content, IonicPage, ViewController, NavParams} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {countryCurrency} from "../../config";

@IonicPage()
@Component({
    selector: 'price-modal',
    templateUrl: 'price-modal.html'
})
export class PriceModalComponent {
    @ViewChild(Content) content: Content

    anArray: any //= [{'label':'', Price:''}];
    form: any = {
        currencyId: countryCurrency[104].id,
        currency: countryCurrency[104].currency,
        code: countryCurrency[104].code,
        symbol: countryCurrency[104].symbol,
    }
    countryCurrency: any = countryCurrency;
    constructor(private viewCtrl: ViewController,
        private util: IonicUtilProvider,
        private translate: TranslateService,
        private navParams: NavParams
    ) {
        this.anArray = this.navParams.get('priceArray');
        this.form = this.navParams.get('currency');
    }

    Add() {
        this.anArray.push({ 'label': '', Price: 0 });
        this.scrollToBottom();
    }
    Remove(index) {
        if (index > -1) {
            this.anArray.splice(index, 1);
        }

    }

    doCancel(): void {
        this.viewCtrl.dismiss();
    }

    dismiss() {
        var arrPrice=[]
        for (var i = 0; i < this.anArray.length; i++) {
            var myPrice = this.anArray[i];
            if (myPrice.label && myPrice.Price > 0) {
                arrPrice.push(myPrice);
            }
        }
        if (arrPrice != null) {
            this.viewCtrl.dismiss({ anArray: arrPrice, currency: this.form });
        } else {
            this.doCancel();
        }
    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.content._scroll) {
                this.content.scrollToBottom(0)
            }
        }, 100)
    }

    onCurrencyChange() {
        let result = this.countryCurrency[this.form.currencyId - 1];
        this.form.code = result.code.trim();
        this.form.symbol = result.symbol.trim();
        this.form.currency = result.currency.trim();
    }



}
