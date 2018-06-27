import {Component, ViewChild} from "@angular/core";
import {Content, Events, IonicPage, App, ModalController, NavController} from "ionic-angular";
import {ChatChannelProvider} from "../../providers/chat-channel/chat-channel";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import _ from "underscore";
import Parse from "parse";

@IonicPage({
    defaultHistory: ['TabsPage']
})
@Component({
    selector: 'page-tab-chat',
    templateUrl: 'tab-chat.html'
})

export class TabChatPage {

    @ViewChild('content') content: Content;

    errorIcon: string = 'chatbubbles';
    errorText: string = '';
    data = [];
    query: any;

    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean = false;

    params = {
        limit: 20,
        page: 1
    }

    constructor(public navCtrl: NavController,
        private events: Events,
        private provider: ChatChannelProvider,
        private modalCtrl: ModalController,
        private analytics: AnalyticsProvider,
        private app: App,) {
        // Google Analytics
        this.analytics.view('ChatChannel page');
        this.data = [];

        let ParseObject = Parse.Object.extend('ChatChannel');
        this.query = new Parse.Query(ParseObject).containedIn('users', [Parse.User.current()]).include('profiles').include('ChatChannelNotify');


        this.query
            .subscribe()
            .on('open', (object) => console.info('subscription opened'))
            .on('create', object => this.onCreateChannel(object))
            .on('update', (object) => console.info('object update', object))
            .on('leave', (object) => console.info('object leave', object))
            .on('delete', object => this.onDeleteChannel(object))
            .on('close', (object) => console.info('subscription close', object))
    }
    //

    ionViewDidLoad() {
        this.events.unsubscribe('channel:reload')
        this.events.unsubscribe('channel:open')
        this.events.subscribe('channel:reload', () => this.doRefresh())
        this.events.subscribe('channel:open', (channelId) => {
            this.onPageMessage(channelId);
        })
        this.doRefresh();
    }
    ionViewWillEnter() {
        this.doRefresh();
    }


    onCreateChannel(object) {

        this.provider.parseChannel(object).then(channel => {
            this.data.push(channel)
            //if (this.data) {
            //    this.content.scrollToBottom(300)
            //}
            this.scrollToBottom();
        });

        this.scrollToBottom();
    }

    onDeleteChannel(object) {
        console.log(object, this.data)
        this.data = _.filter(this.data, item => item.id != object.id)
        if (this.data) {
            this.scrollToBottom()
        }
        //this.scrollToBottom();
    }

    onPageMessage(channelId) {
        // Find item index using _.findIndex (thanks @AJ Richardson for comment)
        var index = _.findIndex(this.data, { id: channelId });
        this.provider.clearNotifyChannel(channelId);
        //this.navCtrl.push('ChatMessagePage', { channel: channelId });
        this.app.getRootNav().push('ChatMessagePage', { channel: channelId });
        if (index !== -1) {
            this.data[index].mescount = 0;
        }

    }


    scrollToBottom(): void {
        setTimeout(() => {
            if (this.content._scroll) {
                this.content.scrollToBottom(300)
            }
        }, 100);
    }

    public doRefresh(event?) {
        this.loading = true;

        this.query.find().then(channels => {
            if (channels) {

                this.data = [];
                Promise
                    .all(channels.map(channel => this.provider.parseChannel(channel)))
                    .then(result => result.map(item => {
                        this.data.push(item)

                    })
                    );
            } else {
                this.showEmptyView = true;
                this.showErrorView = false;
            }

            this.loading = false;
            this.scrollToBottom();
            //this.content.scrollToBottom(300)
            if (event) event.complete();
        }).catch(() => {
            this.loading = false;
            this.showEmptyView = false;
            this.showErrorView = true;
        });
    }


    onModalChatForm() {
        this.modalCtrl.create('ChatFormPage').present();
    }



}
