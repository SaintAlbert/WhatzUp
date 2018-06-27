import {Component, Input} from "@angular/core";
import {ModalController, Events, NavParams, PopoverController, App, NavController} from "ionic-angular";
import {UpcomingProvider} from "../../providers/upcoming/upcoming";
import {GmapProvider} from "../../providers/gmap/gmap";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
//import {ContenteditableModel} from "../../directives/contenteditablemodel/contenteditablemodel";
import {postCategory} from "../../config";

import _ from "underscore";
import Parse from "parse";

/**
 * Generated class for the UpcomingCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'upcoming-detail-card',
    templateUrl: 'upcoming-detail-card.html'
})
export class UpcomingDetailCardComponent {
    @Input() item: any;

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

    constructor(private provider: UpcomingProvider,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private popoverCtrl: PopoverController,
        private app: App,
        private gmap: GmapProvider,
        private launchNavigator: LaunchNavigator,
        private events: Events,
        private navParams: NavParams,
    ) {
        this.user = Parse.User.current();
        this.username = this.user.get('username')
        this.params.username = this.username;
        this.username = Parse.User.current().get('username');
        this.id = this.navParams.get('id');
        this.provider.get(this.id).then(gal => {
            if (gal) {
                this.item = gal;
                this.onUpcoming(this.id);
            }
        })
        this.events.subscribe('upcomingItemShowHeader', (item) => {
            this.isModal = item;
        })
        this.events.subscribe('upcomingComentUpdate', () => {
            this.onUpcoming(this.id);
        })
        this.events.subscribe('upcomingLikeUpdate', (count) => {
            this.item.likesTotal = count;
        })
    }

    onUpcoming(galleryId: string) {
        this.provider.getParse(galleryId).then(gallery => {
            let ParseObject = Parse.Object.extend('UpcomingComment');
            var query = new Parse.Query(ParseObject)
                .include(['profile', 'user'])
                .descending('createdAt')
                .limit(100)
                .descending('createdAt')
                .equalTo('upcoming', gallery);

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

    getCode(code) {
        //console.log(code)
        return code.trim();
    }
    getCategory(codeId) {
        //var fitter = postCategory.filter(item => item.id == codeId)[0]
        //return fitter.cat;
        return "Birthday"
    }
    // this.events.publish('photoItemClose', null);
    sharePhoto(item): void {
        this.modalCtrl.create('ChatSharePhotoPage', { image: item['image'], type: 'upcoming', typeId: item.id }).present();
        this.events.publish('upcomingphotoItemClose', null);
    }
    openProfile(username: string): void {
        this.navCtrl.push('ProfilePage', { username: username })
    }

    openAlbum(item): void {
        this.navCtrl.push('AlbumPhotoGridPage', { id: item.id });
        this.events.publish('upcomingphotoItemClose', null);
    }
    openPhoto(item) {
        this.app.getRootNav().push('UpcomingPhotoPage', { id: item.id });
        this.events.publish('upcomingphotoItemClose', null);
    }
    openPopover(ev): void {
        this.popoverCtrl.create('UpcomingListPopoverPage', { item: this.item }).present({ ev: ev });
    }

    onSelectCategory(category: string) {
        this.navCtrl.push('CategoryPage', { category: category })
        this.events.publish('upcomingphotoItemClose', null);
    }
    onSelectCountryCategory(country_city: string, type: any) {
        this.navCtrl.push('CategoryPage', { country_city: country_city, type: type })
        this.events.publish('upcomingphotoItemClose', null);
    }

    startExternalMap(item, name) {
        this.launchNavigator.navigate(name)
            .then(
            success => console.log('Launched navigator'),
            error => console.log('Error launching navigator', error)
            );
        //item.name = name;
        //this.gmap.startExternalMap(item);
        // console.log(item)
    }


}
