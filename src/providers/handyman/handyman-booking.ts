import { Injectable } from '@angular/core';
import {IParamsLocation} from "../../models/parse.params.location.model";
import {IHandyParams} from "../../models/parse.params.model";
import * as _ from "underscore";

import Parse from "parse";

@Injectable()
export class HandyManBookingProvider {
   
    private _fields = [
        'words',
        'title ',
        'seller',
        'buyer',
        'users',
        'bookingType',
        'bookingId',
        'customerCharge',
        'sellerPayment',
        'checkIn',
        'customerRequirement',
        'amount',
        'totalCharge',
        'totalFees',
        'currency',
        'created',
        'refrence',
        'customerStripeId',
        'sellerStipeAccId',
        'active',
        'completed',
        'payLater',
        'cancel',
        'paid',
        'captured',
        'paymentTransfered',
        'refund',
        'refunded',
        'totalrefunded',
        'stripeChargeId'
    ];

    private _ParseObject: any = Parse.Object.extend('BookingService', {});

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

    createHandyBooking(form: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('createBooking', form).then(resolve, reject);
        })
    }

    public completeService(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('completeService', params).then(resolve, reject)
        })
    }

    public getBooking(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('getBooking', params).then(resolve, reject)
        });
    }

    public cancelBooking(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('cancelBooking', params).then(resolve, reject)
        });
    }

    public accountBalance(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('accountBalance', params).then(resolve, reject)
        });
    }

    public createCharge(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('createCharge', params).then(resolve, reject)
        });
    }

    public retrieveACharge(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('retrieveACharge', params).then(resolve, reject)
        });
    }


    public updateACharge(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('updateACharge', params).then(resolve, reject)
        });
    }
    //public near(params: IParamsLocation): Promise<any> {
    //    return new Promise((resolve, reject) => {
    //        let query = new Parse.Query('Gallery');
    //        // Limit by page
    //        //query.exists('location');
    //        //query.withinKilometers('location', params.location, 100);
    //        query.near('location', params.location);
    //        query.limit(20);

    //        return query.find().then(resolve, reject);
    //    })
    //}


    public search(params): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('searchBooking', params).then(resolve, reject)
        })
    }

   
    // Parse Crud
    get(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('getBooking', { id: objectId }).then(resolve, reject);
        })
    }

    getParse(objectId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            new Parse.Query(this._ParseObject).get(objectId).then(resolve, reject)
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
