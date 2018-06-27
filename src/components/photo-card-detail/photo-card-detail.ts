import {Component, Input, Directive} from "@angular/core";
import {ModalController, NavParams, Events, PopoverController, App, NavController} from "ionic-angular";
import {GalleryProvider} from "../../providers/gallery/gallery";

//import { ImageViewerController } from 'ionic-img-viewer';

import _ from "underscore";
import Parse from "parse";


@Component({
    selector: 'photo-card-detail',
    templateUrl: 'photo-card-detail.html'
})
export class PhotoCardDetailComponent {

    @Input() item: any;
    //_imageViewerCtrl: ImageViewerController
    username: any;
    loadingLike: boolean = false;
    user: any;
    id: any;
    isModal: boolean = false;
    comment: any;

    params = {
        limit: 12,
        page: 1,
        privacity: 'public',
        username: ''
    };

    constructor(private provider: GalleryProvider,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private popoverCtrl: PopoverController,
        private app: App,
        private events: Events,
        private navParams: NavParams,

        //private imageViewerCtrl: ImageViewerController
    ) {
        //this.username = Parse.User.current().get('username');
        this.user = Parse.User.current();
        if (this.navParams.get('hideHeader')) {
            this.isModal = this.navParams.get('hideHeader');
        } else {
            this.events.subscribe('photoItemShowHeader', (item) => {
                this.isModal = item;
            })
        }
        this.username = this.user.get('username')
        this.params.username = this.username;
        this.id = this.navParams.get('id');
        this.provider.get(this.id).then(gal => {
            if (gal) {
                this.item.user = gal.user;
                this.onGallery(this.id);
            }
        })

        this.events.subscribe('photoComentUpdate', () => {
            this.onGallery(this.id);
        })
      
    }


    onGallery(galleryId: string) {
        this.provider.getParse(galleryId).then(gallery => {
            console.log(gallery)
            let ParseObject = Parse.Object.extend('GalleryComment');
            var query = new Parse.Query(ParseObject)
                .include(['profile', 'user'])
                .descending('createdAt')
                .limit(100)
                .descending('createdAt')
                .equalTo('gallery', gallery);

            query.find().then(data => {
                if (data) {
                    this.comment = this.parseData(data).reverse()
                    this.item.commentsTotal = this.comment.length;
                }
            });
        })

    }

    parseData(data: any[]): any[] {
        return _.sortBy(data, 'createdAt').map(item => this.parseItem(item));
    }

    parseItem(item) {
        item.photo = item.get('profile').get('photo') ? item.get('profile').get('photo').url() : 'assets/img/user.png'
        item.class = item.get('user').id === this.user.id ? 'right' : 'left';
        return item;
    }


    openPopover(ev): void {
        this.popoverCtrl.create('PhotoListPopoverPage', { item: this.item }).present({ ev: ev });
    }

    sharePhoto(item): void {
        this.events.publish('photoItemClose', null);
        this.modalCtrl.create('ChatSharePhotoPage', { image: item['image'], type: 'photo', typeId: item.id }).present();
    }

    openComments(item): void {
        //this.modalCtrl.create('PhotoCommentModalPage', { galleryId: item.id }).present();
        let modal = this.modalCtrl.create('PhotoCommentModalPage', { galleryId: item.id });//.present();
        modal.onDidDismiss(() => {
            this.provider.get(item.id).then(gal => {
                if (gal) {
                    item = gal;
                    item.comments = gal.comments;
                    this.events.publish('photoComentUpdate', null);
                }
                this.events.publish('photolistmodal:contentupdate', item);
            });
        });
        modal.present()
    }

    openProfile(username: string): void {
        this.navCtrl.push('ProfilePage', { username: username })
    }

    openAlbum(item): void {
        this.navCtrl.push('AlbumPhotoGridPage', { id: item.id });
    }

    openPhoto(item) {
        this.app.getRootNav().push('PhotoPage', { id: item.id });
    }

    onLike(item): void {

        item.loadingLike = true;
        this.provider.likeGallery(item.id).then(data => {
            if (item.isLiked) {
                item.isLiked = false;
                item.likesTotal--;
            } else {
                item.isLiked = true;
                item.likesTotal++;
            }
            item.loadingLike = false;
            this.events.publish('photolistmodal:contentupdate', item);
        });
    }

    onBookmark(item): void {
        item.loadingBookmark = true;
        this.provider.bookmarkGallery(item.id).then(data => {
            item.isBookmark = !item.isBookmark;
            item.loadingBookmark = false;
            this.events.publish('photolistmodal:contentupdate', item);
        });
    }

    //getGalleryComment(itemId) {
    //    console.log(itemId)
    //    //this.doRefresh();
    //    this.provider.getParse(itemId).then(gallery => {
    //        let ParseObject = Parse.Object.extend('GalleryComment');
    //        this.query = new Parse.Query(ParseObject)
    //            .include(['profile', 'user'])
    //            .descending('createdAt')
    //            .limit(100)
    //            .descending('createdAt')
    //            .equalTo('gallery', gallery);
    //        this.doRefresh();
    //    }).catch(this.onError)

    //}

    //doRefresh() {
    //    this.query.find().then(data => {
    //        if (data) {
    //            this.data = this.parseData(data);

    //        }
    //    }).catch(this.onError)
    //}

    //onError(error) {
    //    console.log(error)
    //}

    //parseData(data: any[]): any[] {
    //    return _.sortBy(data, 'createdAt').map(item => this.parseItem(item));
    //}

    //parseItem(item) {
    //    item.photo = item.get('profile').get('photo') ? item.get('profile').get('photo').url() : 'assets/img/user.png'
    //    item.class = item.get('user').id === this.user.id ? 'right' : 'left';
    //    return item;
    //}





}
