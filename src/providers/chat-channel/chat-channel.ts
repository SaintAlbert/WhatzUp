import {Injectable} from "@angular/core";
import {IChatChannel} from "../../models/chat-channel.model";

import Parse from "parse";

@Injectable()
export class ChatChannelProvider {

    data: any[] = [];

    private _ParseObject: any = Parse.Object.extend('ChatChannel', {});

    constructor() {

    }

    find(): Promise<any> {
        return new Promise((resolve, reject) => {
            new Parse.Query('ChatChannel').containedIn('users', [Parse.User.current()]).include('profiles').find().then(resolve, reject)
        })

    }

    parseChannel(channel): Promise<any> {
       
        return new Promise(resolve => {
            console.log(channel)
            let user = Parse.User.current();
                    let obj = {
                        id: channel.id,
                        obj: channel,
                        title: null,
                        mescount: null,
                        message: channel.get('message'),
                        profiles: []
                    }
                   
                    channel.relation('profiles').query().notEqualTo('user', user).find().then(profiles => {
                        obj.title = profiles.map(profile => profile.get('name')).join(', ');
                        obj.profiles = profiles.map(profile => profile.get('photo') ? profile.get('photo').url() : 'assets/img/user.png')
                        this.getChannelCount(channel.id).then(count => {
                            obj.mescount = count;
                        });
                        resolve(obj);
                    })
                    
         
        })
    }


    // Parse Crud
    get(objectId: string) {
        return new Promise((resolve, reject) => {
            new Parse.Query(this._ParseObject).get(objectId).then(resolve, reject)
        })
    }

    getChatChannel(objectId: string) {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('getChatChannel', { channelId: objectId }).then(resolve, reject)
        })
    }

    create(params: { users: any[], message?: string }): Promise<any> {
        return new Promise((resolve, reject) => {
            Parse.Cloud.run('createChatChannel', params).then(resolve, reject)
        })
    }

    put(item: IChatChannel) {
        if (!item.id) {
            // New Item
            return new this._ParseObject().save(item);
        } else {
            // Update item
            return item.save();
        }
    }

    clearNotifyChannel(channelId: string) {
        let user = Parse.User.current();
        new Parse.Query('ChatChannelNotify')
            .equalTo('toUser', user)
            .equalTo('channelId', channelId)
            .find({
                success: function (posts) {
                    Parse.Object.destroyAll(posts).then(function () {
                        //res.success("success");
                    });
                },
                error: function (error) {
                    // res.error("Error finding posts " + error.code + ": " + error.message);
                },
            });
    }

    getChannelCount(objectId: string) {
        return new Promise((resolve, reject) => {
            new Parse.Query('ChatChannelNotify')
                .equalTo('toUser', Parse.User.current())
                .equalTo('channelId', objectId)
                .equalTo('isRead', false)
                .count()
                .then(resolve);
        })
    }

    destroy(objectId: string) {
        let itemObject: any;
        return new Promise((resolve, reject) => {
            this.get(objectId).then(item => {
                itemObject = item;
                if (itemObject) {
                    itemObject.destroy({}).then(resolve).catch(reject);
                    this.clearNotifyChannel(objectId);
                }
                resolve()
            }).catch(reject);
        });
    }
}
