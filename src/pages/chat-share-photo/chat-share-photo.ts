import {Component, ViewChild} from "@angular/core";
import {NavController, Content, ViewController, App, NavParams, IonicPage, ModalController} from "ionic-angular";
import {ChatChannelProvider} from "../../providers/chat-channel/chat-channel";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

@IonicPage()
@Component({
    selector:    'page-chat-share-photo',
    templateUrl: 'chat-share-photo.html'
})
export class ChatSharePhotoPage {

    @ViewChild('Content') content: Content;

    image: any;
    type: any;
    typeId: any;
    errorIcon: string = 'chatbubbles';
    errorText: string = '';
    data = [];
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    moreItem: boolean = false;


    constructor(public navCtrl: NavController,
                private provider: ChatChannelProvider,
                private viewCtrl: ViewController,
                private app: App,
                private params: NavParams,
                private analytics: AnalyticsProvider,
                private modalCtrl: ModalController,) {
        // Google Analytics
        this.analytics.view('ChatSharePhotoPage');
        this.image = this.params.get('image');
        this.type = this.params.get('type');
        this.typeId = this.params.get('typeId');
        
        this.doRefresh();

        console.log(this.image)
    }

    onPageMessage(item) {
        this.dismiss();
        this.app.getRootNav().push('ChatMessagePage', { channel: item.id, image: this.image, type: this.type, typeId: this.typeId });
    }

    public doRefresh(event?) {
        this.loading = true;

        this.provider.find().then(channels => {
            if (channels) {
                this.data = [];
                Promise
                    .all(channels.map(channel => this.provider.parseChannel(channel)))
                    .then(result => result.map(item => this.data.push(item)));
            } else {
                this.showEmptyView = true;
                this.showErrorView = false;
            }

            this.loading = false;
            if (event) event.complete();
        }).catch(() => {
            this.loading = false;
            this.showEmptyView = false;
            this.showErrorView = true;
        });
    }


    public scrollTop() {
        this.content.scrollToTop();
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


    onModalChatForm() {
      //  this.dismiss()
        this.modalCtrl.create('ChatFormPage').present();
    }

}
