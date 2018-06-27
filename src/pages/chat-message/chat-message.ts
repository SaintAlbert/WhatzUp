/// <reference path="../../directives/autosize/autosize.ts" />
import { Component, ViewChild, HostListener, ElementRef } from '@angular/core'
import { Content, Events, IonicPage, NavController, NavParams, PopoverController, App } from 'ionic-angular'
import { ChatMessageProvider } from '../../providers/chat-message/chat-message'
import { IonicUtilProvider } from '../../providers/ionic-util/ionic-util'
import { ChatChannelProvider } from '../../providers/chat-channel/chat-channel'
import { AnalyticsProvider } from '../../providers/analytics/analytics'
//import { AutosizeDirective } from '../../directives/autosize/autosize'
import _ from 'underscore'
import Parse from 'parse'
//declare const Parse: any;


@IonicPage({
    segment: 'chat/:channel',
    defaultHistory: ['ChatChannelPage']
})
@Component({
    selector: 'page-chat-message',
    templateUrl: 'chat-message.html',
    // directives: [AutosizeDirective],
})

export class ChatMessagePage {

    @ViewChild(Content) content: Content
    @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }
    @ViewChild('textmsgId') element: ElementRef;

    query: any
    channel: any
    channelId: string
    user: any
    image: any
    type: any;
    typeId: any;
    users: any

    errorIcon: string = 'ios-images-outline'
    errorText: string = ''
    loading: boolean = true
    showEmptyView: boolean = false
    showErrorView: boolean = false
    data = []

    form: any = {
        text: '',
    }


    constructor(public navCtrl: NavController,
        private navParams: NavParams,
        private Channel: ChatChannelProvider,
        private popoverCtrl: PopoverController,
        private Message: ChatMessageProvider,
        private util: IonicUtilProvider,
        private events: Events,
        private params: NavParams,
        private analytics: AnalyticsProvider,
        private app: App,
     
    ) {
        // Google Analytics
        this.analytics.view('ChatMessagePage')

        this.channelId = this.navParams.get('channel')
        this.user = Parse.User.current()
        this.image = this.params.get('image')
        this.type = this.params.get('type');
        this.typeId = this.params.get('typeId');

        this.Channel.get(this.channelId).then(data => {
            this.channel = data

            this.initForm()

            if (this.image) {
                this.form.image = this.image
                this.form.type = this.type
                this.form.typeId = this.typeId
                console.log('form', this.form)
                this.onSendMessage()
            }

            this.data = []
            let chatMessage = Parse.Object.extend('ChatMessage')
            this.query = new Parse.Query(chatMessage).include(['profile', 'image']).equalTo('channel', this.channel)

            this.query
                .subscribe()
                .on('open', object => console.info('subscription opened', object))
                .on('create', object => this.onCreateChannel(object))
                .on('update', (object) => console.info('object update', object))
                .on('leave', (object) => console.info('object leave', object))
                .on('delete', object => this.onDeleteChannel(object))
                .on('close', (object) => console.info('subscription close', object))

            this.doRefresh()
        }).catch(this.onError)

    }

    adjust(): void {
        this.element.nativeElement.style.overflow = 'hidden';
        //this.element.nativeElement.style.position = 'relative'
        this.element.nativeElement.style.height = 'auto';
        this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
    }

    ionViewDidLoad() {
        this.events.subscribe('chat:pop', () => this.navCtrl.pop())
    }

    ionViewDidLeave() {
        this.events.unsubscribe('chat:pop')
    }

  

    onCreateChannel(object) {
        console.log(object)
        this.parseChat(object).then(message => {
            console.log(message)
            this.data.push(message)
           // if (this.data != null) { this.scrollToBottom() }
        })
        this.scrollToBottom()
    }

    onDeleteChannel(object) {
        console.log(object, this.data)
        this.data = _.filter(this.data, item => item.id != object.id)
        this.scrollToBottom()
       // if (this.data != null) { this.scrollToBottom() }
    }


    onError(error) {
        console.log(error)
        this.util.toast(error)
    }


    initForm(): void {
        this.form = {
            channel: this.channel,
            user: this.user,
            message: '',
            image: null,
            typeId: '',
            type: '',
            isRead: false,
            file: null,
            audio: null,
            video: null

        }
       
    }

    scrollToBottom(): void {
        setTimeout(() => {
            if (this.data != null && this.content._scroll) {
           
                this.content.scrollToBottom(0)
            
            }
        }, 100)
    }

    public kekypress(event) {
        if (event.keyCode == 13) {
            this.onSendMessage()
        }
    }

    public doRefresh(event?) {
        this.loading = true

        this.query.find().then(messages => {
            if (messages) {
                this.data = []
                console.log(messages)
                Promise
                    .all(messages.map(chat => this.parseChat(chat)))
                    .then(result => result.map(item => this.data.push(item)))
                if (this.data != null) { this.content.scrollToBottom(0)}
            } else {
                this.showEmptyView = true
                this.showErrorView = false
            }

            this.loading = false
            //this.scrollToBottom()
            if (event) event.complete()
        }).catch(() => {
            this.loading = false
            this.showEmptyView = false
            this.showErrorView = true
        })
    }

    parseChat(chat: any): Promise<any> {
        let user = Parse.User.current()
        return new Promise(resolve => {
            let obj = {
                id: chat.id,
                obj: chat,
                createdAt: chat.createdAt,
               // image: chat.get('image') ? chat.get('image').get('image').url() : null,
                image: chat.get('image') ? chat.get('image') : null,
                message: chat.get('message'),
                class: user.id === chat.get('user').id ? 'right' : 'left',
                profile: {
                    name: chat.get('profile').get('name'),
                    photo: chat.get('profile').get('photo') ? chat.get('profile').get('photo').url() : 'assets/img/user.png',
                },
                typeId: chat.get('typeId'),
                type: chat.get('type'),
            }

            resolve(obj)

        })
    }


    onSendMessage(): void {
        if (this.form.message.length>0 || this.form.image) {
            let form = this.form
            this.initForm()
            this.Message.create(form).then(message => {
                this.element.nativeElement.style.height = 'auto';
            }).catch(error => {
                this.util.toast('Error')
            })
        }
    }

    popover(event): void {
        this.popoverCtrl.create('ChatMessagePopoverPage', { id: this.channelId }).present({ ev: event })
    }

    openPhoto(item) {
        if (item.type == 'photo') {
            this.app.getRootNav().push('PhotoPage', { id: item.typeId });
        }
        if (item.type == 'upcoming') {
            this.app.getRootNav().push('UpcomingPhotoPage', { id: item.typeId });
        }      
    }

}
