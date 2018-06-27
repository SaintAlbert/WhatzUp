//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import {SOCKET_SERVER_URL} from "../../config";
import {UserProvider} from "../../providers/user/user";
//import * as io from "socket.io-client";

/*
  Generated class for the SocketConectionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var window: any

@Injectable()
export class SocketConectionProvider {
    //socket: any=window.connectWhatzUp;
    user: any
    // this RTCMultiConnection object is used to connect with existing users
    //connection: any //= window.initRTCMultiConnection();
    onMessageCallbacks: any = {};
    videoscontainer: any = HTMLDivElement;
    constructor() {
        //console.log('Hello SocketConectionProvider Provider' + this.socket);
        //// this.socketInit();
        //this.socket = io.connect(SOCKET_SERVER_URL);

        //// using single socket for RTCMultiConnection signaling
        //this.socket.on('message', function (data) {
        //    if (data.sender == this.connection.userid) return;
        //    if (this.onMessageCallbacks[data.channel]) {
        //        this.onMessageCallbacks[data.channel](data.message);
        //    };
        //    console.log(data);
        //});
        //window.connectWhatzUp(SOCKET_SERVER_URL);

    }


    socketInit(user) {
        window.socketInit(user)
        //this.user = user;
        //this.socket.on('update-connection', function (data) {
        //    console.log(data)
        //});


        //// using single socket for RTCMultiConnection signaling
        //this.socket.emit('join-connection', {
        //    userid: user.id,
        //    user: user,
        //});
    }

    InitBroadCastConnectionAttach(userid) {
    }

    openOrJoin(broadcastEventid: string, broadcasttype: string) {
        window.openOrJoin(broadcastEventid);
    }

    //// initializing RTCMultiConnection constructor.
    //initRTCMultiConnection(userid) {
    //    var connection = new window.RTCMultiConnection();
    //    connection.body = this.videoscontainer;//document.getElementById('videos-container');
    //    connection.channel = connection.sessionid = connection.userid = userid || connection.userid;
    //    connection.sdpConstraints.mandatory = {
    //        OfferToReceiveAudio: false,
    //        OfferToReceiveVideo: true
    //    };
    //    // using socket.io for signaling
    //    connection.openSignalingChannel = function (config) {
    //        var channel = config.channel || this.channel;
    //        console.log(JSON.stringify(config));
    //        this.onMessageCallbacks[channel] = config.onmessage;
    //        if (config.onopen) setTimeout(config.onopen, 1000);
    //        return {
    //            send: function (message) {
    //                this.socket.emit('message', {
    //                    sender: connection.userid,
    //                    channel: channel,
    //                    message: message
    //                    // broadcasttype: broadcasttype
    //                });
    //            },
    //            channel: channel
    //        };
    //    };
    //    connection.onMediaError = function (error) {
    //        alert(JSON.stringify(error));
    //    };
    //    return connection;
    //}


    //InitBroadCastConnectionAttach(userid) {
    //    //var connection = this.initRTCMultiConnection(userid);
    //    // this RTCMultiConnection object is used to connect with existing users
    //    var connection = window.initRTCMultiConnection();
    //    console.log(JSON.stringify(connection));
    //    connection.getExternalIceServers = false;
    //    connection.onstream = function (event) {
    //        connection.body.appendChild(event.mediaElement);
    //        if (connection.isInitiator == false && !connection.broadcastingConnection) {
    //            // "connection.broadcastingConnection" global-level object is used
    //            // instead of using a closure object, i.e. "privateConnection"
    //            // because sometimes out of browser-specific bugs, browser 
    //            // can emit "onaddstream" event even if remote user didn't attach any stream.
    //            // such bugs happen often in chrome.
    //            // "connection.broadcastingConnection" prevents multiple initializations.
    //            // if current user is broadcast viewer
    //            // he should create a separate RTCMultiConnection object as well.
    //            // because node.js server can allot him other viewers for
    //            // remote-stream-broadcasting.
    //            connection.broadcastingConnection = this.initRTCMultiConnection(connection.userid);
    //            // to fix unexpected chrome/firefox bugs out of sendrecv/sendonly/etc. issues.
    //            connection.broadcastingConnection.onstream = function () { };
    //            connection.broadcastingConnection.session = connection.session;
    //            connection.broadcastingConnection.attachStreams.push(event.stream); // broadcast remote stream
    //            connection.broadcastingConnection.dontCaptureUserMedia = true;
    //            // forwarder should always use this!
    //            connection.broadcastingConnection.sdpConstraints.mandatory = {
    //                OfferToReceiveVideo: false,
    //                OfferToReceiveAudio: false
    //            };
    //            connection.broadcastingConnection.open({
    //                dontTransmit: true
    //            });
    //        }
    //    };



    //    // this event is emitted when a broadcast is already created.
    //    this.socket.on('join-broadcaster', function (broadcaster, typeOfStreams) {
    //        console.log('join-broadcaster ' + broadcaster);
    //        console.log('join-broadcaster ' + typeOfStreams);
    //        connection.session = typeOfStreams;
    //        connection.channel = connection.sessionid = broadcaster.userid;
    //        connection.sdpConstraints.mandatory = {
    //            OfferToReceiveVideo: !!connection.session.video,
    //            OfferToReceiveAudio: !!connection.session.audio
    //        };
    //        connection.join({
    //            sessionid: broadcaster.broadcastid,
    //            userid: broadcaster.userid,
    //            extra: {},
    //            session: connection.session
    //        });
    //    });
    //    // this event is emitted when a broadcast is absent.
    //    this.socket.on('start-broadcasting', function (typeOfStreams) {
    //        // host i.e. sender should always use this!
    //        console.log('start-broadcaster ' + connection);
    //        connection.sdpConstraints.mandatory = {
    //            OfferToReceiveVideo: false,
    //            OfferToReceiveAudio: false
    //        };
    //        connection.session = typeOfStreams;
    //        connection.open({
    //            dontTransmit: true
    //        });
    //        if (connection.broadcastingConnection) {
    //            // if new person is given the initiation/host/moderation control
    //            connection.broadcastingConnection.close();
    //            connection.broadcastingConnection = null;
    //        }
    //    });
    //    this.connection = connection;

    //}



    //// ask node.js server to look for a broadcast
    //// if broadcast is available, simply join it. i.e. "join-broadcaster" event should be emitted.
    //// if broadcast is absent, simply create it. i.e. "start-broadcasting" event should be fired.
    //openOrJoin(broadcastEventid: string, broadcasttype: string) {
    //    var broadcastid = broadcastEventid;
    //    if (broadcastid.replace(/^\s+|\s+$/g, '').length <= 0) {
    //        alert('Please enter broadcast-id');
    //        //document.getElementById('broadcast-id').focus();
    //        return;
    //    }
    //    //this.disabled = true;
    //    this.connection.session = {
    //        video: 'Video',//document.getElementById('broadcast-options').value.indexOf('Video') !== -1,
    //        screen: 'Screen',//document.getElementById('broadcast-options').value.indexOf('Screen') !== -1,
    //        audio: 'Audio',//document.getElementById('broadcast-options').value.indexOf('Audio') !== -1,
    //        oneway: true
    //    };
    //    //console.log(JSON.stringify(this.connection));
    //    this.socket.emit('join-broadcast', {
    //        broadcastid: broadcastid,
    //        userid: this.connection.userid,
    //        typeOfStreams: this.connection.session
    //        //broadcasttype: broadcasttype
    //    });
        
    //};







}
