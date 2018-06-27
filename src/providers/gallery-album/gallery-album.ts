import {Injectable} from "@angular/core";
//declare var Parse: any;
import Parse from "parse";

@Injectable()
export class GalleryAlbumProvider {

    private _fields = [
        'title',
        'description',
        'lang',
        'qtyPhotos',
        'user',
        'image',
        'imageThumb',
    ];

    private _ParseObject: any = Parse.Object.extend('GalleryAlbum', {});

    data: any[] = [];

    constructor() {

        this._fields.map(field => {
            Object.defineProperty(this._ParseObject.prototype, field, {
                get: function () {return this.get(field)},
                set: function (value) { this.set(field, value)}
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(this._ParseObject.prototype, 'location', {
            get: function () {return this.get('location');},
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude : val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }

    find(params: any): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('listAlbum', params).then(resolve,reject)
        })
    }

    photo(params: any):Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('photoAlbum', params).then(resolve,reject)
        })
    }

    getAlbum(params):Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('getAlbum', params).then(resolve,reject)
        })
    }

    // Parse Crud
    get(parseId: string):Promise<any> {
        return new Promise((resolve, reject)=>{
          new Parse.Query(this._ParseObject).include('profile').get(parseId).then(resolve,reject)
        })
    }

    put(item: any):Promise<any> {

        return new Promise((resolve, reject)=>{
          if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
          }

          if (!item.id) {
            let objPlace = new this._ParseObject();
            return objPlace.save(item);
          } else {
            return item.save().then(resolve,reject)
          }
        })

    }

    destroy(item) {
        return item.destroy();
    }
}
