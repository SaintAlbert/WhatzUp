import { Component } from '@angular/core';
import {  ViewController, NavParams, ModalController, IonicPage, NavController, PopoverController, Events } from 'ionic-angular';
import {UpcomingProvider} from "../../providers/upcoming/upcoming";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {postCategory} from "../../config";
import Parse from "parse";
import _ from "underscore";

@IonicPage()
@Component({
    selector: 'pageupcoming-modalpost',
    templateUrl: 'modal-post-upcoming.html',
 
})
export class ModalUpcomingPost {

    item: any;
    id: any;
    loading: boolean = true;
    query: any;
    data = [];
    user: any;
    username: any;
    eventName: string = 'upcomingphoto';


    constructor(private navParams: NavParams,
        public viewCtrl: ViewController,
        private provider: UpcomingProvider,
        private analytics: AnalyticsProvider,
        private popoverCtrl: PopoverController,
        private navCtrl: NavController,
        private events: Events,
        private modalCtrl: ModalController,

    ) {
        // Google Analytics
        this.analytics.view('UpcomingPage');
        this.id = this.navParams.get('id');
        this.user = Parse.User.current();
        this.username = this.user.get('username')

        this.load();


    }

    load() {

        if (this.navParams.get('item') !== null) {
            this.item = this.navParams.get('item');
            this.loading = false;
        } else {
            this.loading = true;
            this.provider.get(this.id).then(upcoming => {
                console.log('Upcoming', upcoming);
                this.item = upcoming;
                this.loading = false;
            });
        }
    }


    ionViewWillEnter() {
        this.user = Parse.User.current();
        this.events.publish('upcomingItemShowHeader', true);
        // this.hide = false;
        this.loading = true;

        if (this.navParams.get('item') !== null) {
            this.item = this.navParams.get('item');
            this.loading = false;
        } else {
            this.loading = true;
            this.provider.get(this.id).then(upcoming => {
                console.log('gallery', upcoming);
                this.item = upcoming;
                this.loading = false;
            });
        }

        this.events.subscribe('upcomingphotoItemClose', () => {
            this.viewCtrl.dismiss();
        })
    }

    openPopover(ev): void {
        this.popoverCtrl.create('UpcomingListPopoverPage', { item: this.item }).present({ ev: ev });
    }

    openProfile(username: string): void {
        this.navCtrl.push('ProfilePage', { username: username })
        this.viewCtrl.dismiss();
    }
    dismiss() {
        //this.events.publish('photolistmodal:reload', null);
        this.viewCtrl.dismiss();
        this.events.publish('upcomingItemShowHeader', false);

    }

    getCategory(codeId) {
        //var fitter = postCategory.filter(item => item.id == codeId)[0]
        ////console.log(fitter.cat)
        //if (fitter)
        //    return fitter.cat;
        return "Birthday"
    }

    sharePhoto(item): void {
        //console.log(item)
        // this.modalCtrl.create('ChatSharePhotoPage', { image: item.obj }).present();
        this.modalCtrl.create('ChatSharePhotoPage', { image: item['image'], type: 'upcoming', typeId: item.id }).present();
        this.dismiss();
    }

    openComments(item): void {
        //this.modalCtrl.create('UpcomingCommentModalPage', { galleryId: item.id }).present()
        let modal = this.modalCtrl.create('UpcomingCommentModalPage', { galleryId: item.id });//.present();
        modal.onDidDismiss(() => {
            this.provider.get(item.id).then(upcoming => {
                if (upcoming) {
                    this.item = upcoming;
                    //console.log(upcoming.comments.length)
                    this.events.publish('upcomingComentUpdate', upcoming.comments);
                    //item.comments = upcoming.comments;
                    this.events.publish('upcoming-list:reload', null);

                }
            });
        });
        modal.present()
    }

    onLike(item): void {
        item.loadingLike = true;
        this.provider.likeUpcoming(item.id).then(data => {
            if (item.isLiked) {
                item.isLiked = false;
                item.likesTotal--;
            } else {
                item.isLiked = true;
                item.likesTotal++;
            }
            item.loadingLike = false;
            this.events.publish('upcomingLikeUpdate', item.likesTotal);
            this.events.publish('upcoming-list:reload', null);
        });
    }

    onBookmark(item): void {
        item.loadingBookmark = true;
        this.provider.bookmarkUpcoming(item.id).then(data => {
            item.isBookmark = !item.isBookmark;
            item.loadingBookmark = false;
            this.events.publish('upcoming-list:reload', null);
        });
    }





}