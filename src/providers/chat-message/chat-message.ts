import {Injectable} from "@angular/core";
import {IGallery} from "../../models/gallery.model";
import {IChatMessage} from "../../models/chat-message.model";
//declare var Parse: any;
import Parse from "parse";

@Injectable()
export class ChatMessageProvider {

    data: any[] = [];

    private _fields = [
        'channel',
        'user',
        'message',
        'updated',
    ];

    private _ParseObject: any = Parse.Object.extend('ChatMessage', {});

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

    find(channelId: string): Promise<any> {
        return new Promise((resolve, reject)=>{
          Parse.Cloud.run('getChatMessages', {channelId: channelId}).then(resolve,reject)
        })
    }

    // Parse Crud
    get(objectId: string) {
        return new Promise((resolve, reject)=>{
         new Parse.Query(this._ParseObject).get(objectId).then(resolve,reject)
        })
    }

    create(item: IChatMessage) {
        return new Promise((resolve, reject)=>{
          new this._ParseObject().save(item).then(resolve,reject)
        })
    }

    put(item: IGallery) {

        return new Promise((resolve, reject)=>{
          if (item.address && item.address.geo) {
            item.location = new Parse.GeoPoint(item.address.geo);
          }

          if (!item.id) {
            // New Item
            return new this._ParseObject().save(item);
          } else {
            // Update item
            return item.save().then(resolve,reject)
          }
        })

    }

    destroy(objectId: string) {
        return new Promise((resolve, reject) => {
            this.get(objectId).then(item => {
                // item.destroy().then(resolve).catch(reject);
            }).catch(reject);
        });
    }
}
