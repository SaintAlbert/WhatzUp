import {Injectable} from '@angular/core';
import Parse from "parse";
//declare var Parse: any;

@Injectable()
export class GallerFeedbackProvider {

    private _fields = [
        'title',
        'subject',
        'message',
        'user',
        'gallery',
    ];

    private _ParseObject: any = Parse.Object.extend('GalleryFeedback', {});

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

    create(item) {
        return new Promise((resolve, reject)=>{
          let ParseObjectRow = new this._ParseObject();
          ParseObjectRow.save(item).then(resolve,reject)
        })
    }

    put(item) {

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
