import {Injectable} from "@angular/core";
import {IParamsLocation} from "../../models/parse.params.location.model";
import {IGallery} from "../../models/gallery.model";
import {IParams} from "../../models/parse.params.model";

import Parse from "parse";
//declare var Parse: any;


@Injectable()
export class GalleryProvider {

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
    ];

    private _ParseObject: any = Parse.Object.extend('Gallery', {});

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

    public near(params: IParamsLocation): Promise<any> {
       return new Promise((resolve, reject)=>{
         let query = new Parse.Query('Gallery');
         // Limit by page
         //query.exists('location');
         //query.withinKilometers('location', params.location, 100);
         query.near('location',params.location);
         query.limit(20);

         return query.find().then(resolve,reject);
       })
    }

    public likeGallery(objectId: string): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('likeGallery', {galleryId: objectId}).then(resolve,reject)
        })
    }

    public bookmarkGallery(objectId: string): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('galleryBookmark', {galleryId: objectId}).then(resolve,reject)
        })
    }
    public feedBookmarkGallery(params: IParams): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('feedGalleryBookmark', params).then(resolve,reject)
        })
    }

    public follow(params): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('followUser', params).then(resolve,reject)
        })
    }

    public search(params): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('searchGallery', params).then(resolve,reject)
        })
    }

    public updatedGallery(params: any): Promise<any> {
        console.log('update', params);
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('updateGallery', params).then(resolve,reject)
        })
    }


    public feed(params: IParams): Promise<any> {
       
        return new Promise((resolve, reject) => {
          Parse.Cloud.run('feedGallery', params).then(resolve,reject)
        });
    }

    comments(params) {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('commentGallery', params).then(resolve,reject)
        })
    }

    // Parse Crud
    get(objectId: string): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('getGallery', {id: objectId}).then(resolve,reject);
        })
    }

    getParse(objectId: string): Promise<any> {
        return new Promise((resolve, reject)=>{
          new Parse.Query(this._ParseObject).get(objectId).then(resolve,reject)
        })
    }


    createGallery(form:any):Promise<any>{
        return new Promise((resolve, reject)=>{
            Parse.Cloud.run('createGallery', form).then(resolve,reject);
        })
    }

    put(item: IGallery):Promise<any> {
       return new Promise((resolve, reject)=>{
         if (item.address && item.address.geo) {
           item.location = new Parse.GeoPoint(item.address.geo);
         }

         if (!item.id) {
           // New Item
           return new this._ParseObject().save(item);
         } else {
           // Update item
           item.save().then(resolve,reject)
         }
       })

    }

    destroy(objectId: string) {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('destroyGallery', {id: objectId}).then(resolve,reject)
        })
    }

    
}
