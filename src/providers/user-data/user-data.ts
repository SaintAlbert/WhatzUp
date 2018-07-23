import {Injectable} from "@angular/core";

import Parse from "parse";

@Injectable()
export class UserDataProvider {

    private _fields = [
        'followingsTotal',
        'followersTotal',
        'commentsTotal',
        'galleriesTotal',
        'albumTotal',
        'photo',
        'status',
        'name',
        'username',
        'user',
        'stripeId',
    ];

    private _ParseObject: any = Parse.Object.extend('UserData', {});

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

    current(): any {
        return Parse.User.current();
    }

    profile(username: string): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('profile', {username: username}).then(resolve,reject)
        })
    }

}
