import {Injectable} from "@angular/core";
import Parse from "parse";

/*
  Generated class for the UpcomingCommentProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UpcomingCommentProvider {
    private _fields = [
        'text',
        'user',
    ];

    private _ParseObject: any = Parse.Object.extend('UpcomingComment', {});

    constructor() {
        this._fields.map(field => {
            Object.defineProperty(this._ParseObject.prototype, field, {
                get: function () {
                    return this.get(field)
                },
                set: function (value) {
                    this.set(field, value)
                }
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(this._ParseObject.prototype, 'location', {
            get: function () {
                return this.get('location');
            },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude: val.latitude,
                    longitude: val.longitude
                }));
            }
        });
    }

    create(item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            new this._ParseObject().save(item).then(resolve, reject)
        })
    }

    put(item: any): Promise<any> {
        return new Promise((resolve, reject) => {

            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            if (!item.id) {
                let objPlace = new this._ParseObject();
                return objPlace.save(item);
            } else {
                return item.save().then(resolve, reject)
            }
        })

    }

    destroy(item): Promise<any> {
        return item.destroy();
    }

}
