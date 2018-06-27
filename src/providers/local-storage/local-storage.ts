import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";

declare const window: any;

@Injectable()
export class LocalStorageProvider {
  cordova: boolean = false
  storage: any     = window.localStorage

  constructor(private platform: Platform) {
    this.cordova = this.platform.is('cordova') ? true : false
  }

  set(key: string, value: any): any {
    return this.storage.setItem(key, value)
  }

  get(key: string): Promise<any> {
    return new Promise(
      resolve => {
        let result = this.storage.getItem(key)
        resolve(result)
      })
  }

  get started(): Promise<any> {
    return this.get('started');
  }

  set started(val) {
    this.set('started', val);
  }

  get skipIntroPage(): Promise<any> {
    return this.get('skipIntroPage');
  }

  set skipIntroPage(val) {
    this.set('skipIntroPage', val);
  }

  get unit(): Promise<any> {
    return this.get('unit');
  }

  set unit(val) {
    this.set('unit', val);
  }

  get mapStyle(): Promise<any> {
    return this.get('mapStyle');
  }

  set mapStyle(val) {
    this.set('mapStyle', val);
  }

  get distance(): Promise<any> {
    return this.get('distance');
  }

  set distance(val) {
    this.set('distance', val);
  }

  get lang(): Promise<any> {
    return this.get('lang');
  }

  set lang(val) {
    this.set('lang', val);
  }

  // Category
  get category(): Promise<any> {
    return this.get('category');
  }

  set category(val) {
    this.set('category', val);
  }

  remove(val) {
    return this.storage.removeItem(val);
  }

  // price
  get price(): Promise<any> {
    return this.get('price');
  }

  set price(val) {
    this.set('price', val);
  }

  // location
  get location(): Promise<any> {
    return this.get('location');
  }

  set location(val) {
    this.set('location', val);
  }

}
