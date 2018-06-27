//const WebRTCScalable = require( './cloud/WebRTC-Scalable-Broadcast.js' )

window.SOCKET_SERVER_URL = "http://localhost:1337/"
var socket = io( SOCKET_SERVER_URL )//io();//.connect( 'http://localhost:1338/' );
    window.onMessageCallbacks = {};
    //window.connectWhatzUp = function ( url ) {
    //    socket = io.connect( url );
    //}
    // using single socket for RTCMultiConnection signaling
    
    window.socketInit = function ( user ) {
        this.user = user;
        this.socket.on( 'update-connection', function ( data ) {
            console.log( data )
        } );

        // using single socket for RTCMultiConnection signaling
        this.socket.emit( 'join-connection', {
            userid: user.id,
            user: user,
        } );
    }
    socket.on( 'message', function ( data ) {
        if ( data.sender == connection.userid ) return;
        if ( window.onMessageCallbacks[data.channel] )
        {
            window.onMessageCallbacks[data.channel]( data.message );
        };
        console.log( JSON.log( window.onMessageCallbacks ) )
    } );

    // initializing RTCMultiConnection constructor.
    window.initRTCMultiConnection = function ( userid ) {
        var connection = new RTCMultiConnection();
        connection.body = document.getElementById( 'videos-container' );
        connection.channel = connection.sessionid = connection.userid = userid || connection.userid;
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: true
        };
        // using socket.io for signaling
        connection.openSignalingChannel = function ( config ) {
            var channel = config.channel || this.channel;
            window.onMessageCallbacks[channel] = config.onmessage;
            if ( config.onopen ) setTimeout( config.onopen, 1000 );
            return {
                send: function ( message ) {
                    socket.emit( 'message', {
                        sender: connection.userid,
                        channel: channel,
                        message: message
                    } );
                },
                channel: channel
            };
        };
        connection.onMediaError = function ( error ) {
            alert( JSON.stringify( error ) );
        };
        return connection;
    }

    // this RTCMultiConnection object is used to connect with existing users
    var connection = initRTCMultiConnection();

    connection.getExternalIceServers = false;

    connection.onstream = function ( event ) {
        connection.body.appendChild( event.mediaElement );

        if ( connection.isInitiator == false && !connection.broadcastingConnection )
        {
            // "connection.broadcastingConnection" global-level object is used
            // instead of using a closure object, i.e. "privateConnection"
            // because sometimes out of browser-specific bugs, browser 
            // can emit "onaddstream" event even if remote user didn't attach any stream.
            // such bugs happen often in chrome.
            // "connection.broadcastingConnection" prevents multiple initializations.

            // if current user is broadcast viewer
            // he should create a separate RTCMultiConnection object as well.
            // because node.js server can allot him other viewers for
            // remote-stream-broadcasting.
            connection.broadcastingConnection = initRTCMultiConnection( connection.userid );

            // to fix unexpected chrome/firefox bugs out of sendrecv/sendonly/etc. issues.
            connection.broadcastingConnection.onstream = function () { };

            connection.broadcastingConnection.session = connection.session;
            connection.broadcastingConnection.attachStreams.push( event.stream ); // broadcast remote stream
            connection.broadcastingConnection.dontCaptureUserMedia = true;

            // forwarder should always use this!
            connection.broadcastingConnection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false
            };

            connection.broadcastingConnection.open( {
                dontTransmit: true
            } );
        }
    };

    // ask node.js server to look for a broadcast
    // if broadcast is available, simply join it. i.e. "join-broadcaster" event should be emitted.
    // if broadcast is absent, simply create it. i.e. "start-broadcasting" event should be fired.
    window.openOrJoin = function ( broadcastid ) {
        var broadcastid = broadcastid;
        if ( broadcastid.replace( /^\s+|\s+$/g, '' ).length <= 0 )
        {
            alert( 'Please enter broadcast-id' );
            document.getElementById( 'broadcast-id' ).focus();
            return;
        }

        //this.disabled = true;

        connection.session = {
            video: 'Video',//document.getElementById('broadcast-options').value.indexOf('Video') !== -1,
            //screen: 'Screen',//document.getElementById('broadcast-options').value.indexOf('Screen') !== -1,
            audio: 'Audio',//document.getElementById('broadcast-options').value.indexOf('Audio') !== -1,
            oneway: true
        };

        socket.emit( 'join-broadcast', {
            broadcastid: broadcastid,
            userid: connection.userid,
            typeOfStreams: connection.session
        } );

    }

    // this event is emitted when a broadcast is already created.
    socket.on( 'join-broadcaster', function ( broadcaster, typeOfStreams ) {
        connection.session = typeOfStreams;
        connection.channel = connection.sessionid = broadcaster.userid;

        connection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: !!connection.session.video,
            OfferToReceiveAudio: !!connection.session.audio
        };

        connection.join( {
            sessionid: broadcaster.userid,
            userid: broadcaster.userid,
            extra: {},
            session: connection.session
        } );
    } );

    // this event is emitted when a broadcast is absent.
    socket.on( 'start-broadcasting', function ( typeOfStreams ) {
        // host i.e. sender should always use this!
        connection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: false,
            OfferToReceiveAudio: false
        };
        connection.session = typeOfStreams;
        connection.open( {
            dontTransmit: true
        } );

        if ( connection.broadcastingConnection )
        {
            // if new person is given the initiation/host/moderation control
            connection.broadcastingConnection.close();
            connection.broadcastingConnection = null;
        }
    } );

