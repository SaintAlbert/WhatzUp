import {Injectable} from "@angular/core";
import {IParamsLocation} from "../../models/parse.params.location.model";
import {IUpcoming} from "../../models/upcoming.model";
import {IParams} from "../../models/parse.params.model";
import {GmapProvider} from "../../providers/gmap/gmap";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";

import Parse from "parse";
//declare var Parse: any;


/*
  Generated class for the UpcomingProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UpcomingProvider {

    private _fields = [
        'title',
        'commentsTotal',
        'views',
        'likesTotal',
        'user',
        'profile',
        'hashtags',
        'words',
        'privacity',
        'address',
        'lang',
        'image',
        'imageThumb',
        'isApproved',
        'icon',
        'description',
        'category',
        'categoryId',
        'currencyId',
        'currency',
        'code',
        'symbol',
        'startDate',
        'endDate',
        'priceType',
        'price',
      
        'canbook',
        'chargefee',
        'attendant',
        'publicfee',
        'frendship',
        'contact'
        
    ];

    private _ParseObject: any = Parse.Object.extend('Upcoming', {});

    data: any[] = [];
    thisLocation: any

    constructor(private gmap: GmapProvider, private storage: LocalStorageProvider,) {
      

        this._fields.map(field => {
            Object.defineProperty(this._ParseObject.prototype, field, {
                get: function () { return this.get(field) },
                set: function (value) { this.set(field, value) }
            });
        });

        // This is a GeoPoint Object
        Object.defineProperty(this._ParseObject.prototype, 'location', {
            get: function () { return this.get('location'); },
            set: function (val) {
                this.set('location', new Parse.GeoPoint({
                    latitude: val.latitude,
                    longitude: val.longitude
                }));
                //this.set('locale', val.city + ', ' + val.country)

            }
        });

        this.gmap.getUserLocation(false).then((a) => {
            if (a != null) {
                //if (a.city != undifined && a.country != null) {
                //    storage.set('locale', a.city + ', ' + a.country);
                //}
                console.log(a)
                //this.thisLocation = a.geo;
               
            } else {
                this.gmap.getUserLocation(true).then((a) => {
                    if (a != null) {
                        console.log(a)
                        //if (a.city != null && a.country != null) {
                        //    storage.set('locale', a.city + ', ' + a.country);
                        //}
                        // this.thisLocation = a.geo;

                    } else {
                        storage.set('locale', '');
                    }
                })
            }
        });

      

    }

    public near(params: IParamsLocation): Promise<any> {
        return new Promise((resolve, reject) => {
            let query = new Parse.Query('Upcoming');
            // Limit by page
            //query.exists('location');
            //query.withinKilometers('location', params.location, 100);
            query.greaterThanOrEqualTo('endDate', new Date());
            query.near('location', params.location);
            //query.limit(params.limit);

            return query.find().then(resolve, reject);
        })
    }

    public likeUpcoming(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('likeUpcoming', { galleryId: objectId }).then(resolve, reject)
        })
    }

    public bookmarkUpcoming(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('upcomingBookmark', { galleryId: objectId }).then(resolve, reject)
        })
    }
    public feedBookmarkUpcoming(params: IParams): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('feedUpcomingBookmark', params).then(resolve, reject)
        })
    }

    public follow(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('followUser', params).then(resolve, reject)
        })
    }

    public search(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('searchGallery', params).then(resolve, reject)
        })
    }

    public updatedUpcoming(params: any): Promise<any> {
        console.log('update', params);
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('updateUpcoming', params).then(resolve, reject)
        })
    }


    public feed(params: IParams): Promise<any> {
        if (this.thisLocation && params.location == null) {
            params.location = this.thisLocation;
        }
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('feedUpcoming', params).then(resolve, reject)
        });
    }

    comments(params) {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('commentUpcoming', params).then(resolve, reject)
        })
    }

    // Parse Crud
    get(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('getUpcoming', { id: objectId }).then(resolve, reject);
        })
    }

    getParse(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            new Parse.Query(this._ParseObject).get(objectId).then(resolve, reject)
        })
    }


    createUpcoming(form: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('createUpcoming', form).then(resolve, reject);
        })
    }

    put(item: IUpcoming): Promise<any> {

        return new Promise((resolve, reject) => {
            if (item.address && item.address.geo) {
                item.location = new Parse.GeoPoint(item.address.geo);
            }

            if (!item.id) {
                // New Item
                return new this._ParseObject().save(item);
            } else {
                // Update item
                item.save().then(resolve, reject)
            }
        })

    }

    destroy(objectId: string) {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('destroyUpcoming', { id: objectId }).then(resolve, reject)
        })
    }


}
