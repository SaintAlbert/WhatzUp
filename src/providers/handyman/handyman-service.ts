import { Injectable } from '@angular/core';
import {IParamsLocation} from "../../models/parse.params.location.model";
import {IHandyParams} from "../../models/parse.params.model";
import * as _ from "underscore";

import Parse from "parse";

@Injectable()
export class HandyManProvider {

    private _fields = [
        'title',
        'handyHeader',
        'handyKey',
        'handyHeaderId',
        'handyPackage',
        'iconHeader',
        'iconKey',
        'views',
        'country',
        'privacity',
        'openingDay',
        'openingTime',
        'venue',
        'price',
        'currencyId',
        'currency',
        'symbol',
        'code',
        'min',
        'location',
        'user',
        'profile',
        'hashtags',
        'words',
        'address',
        'lang',
        'image',
        'imageThumb',
        'isApproved',
        'commentsTotal',
        'likesTotal',
        'isLiked',
        'comments',
        'offerHomeService',

    ];

    private _ParseObject: any = Parse.Object.extend('HandyMan', {});

    data: any[] = [];

    constructor() {

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
            }
        });
    }


    public near(params: IParamsLocation): Promise<any> {
        return new Promise((resolve, reject) => {
            let query = new Parse.Query('Gallery');
            // Limit by page
            //query.exists('location');
            //query.withinKilometers('location', params.location, 100);
            query.near('location', params.location);
            query.limit(20);

            return query.find().then(resolve, reject);
        })
    }


    public search(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('searchHandyMan', params).then(resolve, reject)
        })
    }

    public updateHandyTask(params: any): Promise<any> {
        console.log('update', params);
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('updateHandyTask', params).then(resolve, reject)
        })
    }

    public feed(params: IHandyParams): Promise<any> {

        return new Promise((resolve, reject) => {
            Parse.Cloud.run('handyFeed', params).then(resolve, reject)
        });
    }

    // Parse Crud
    get(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('getHandy', { id: objectId }).then(resolve, reject);
        })
    }

    getParse(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            new Parse.Query(this._ParseObject).get(objectId).then(resolve, reject)
        })
    }


    createHandyTask(form: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('createHandyTask', form).then(resolve, reject);
        })
    }

    put(item: any): Promise<any> {
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
            Parse.Cloud.run('destroyHandyTask', { id: objectId }).then(resolve, reject)
        })
    }

    comments(params) {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('commentHandyMan', params).then(resolve, reject)
        })
    }




}
