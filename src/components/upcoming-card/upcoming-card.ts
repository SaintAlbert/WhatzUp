import {Component, Input} from "@angular/core";
import {ModalController, PopoverController, App, NavController} from "ionic-angular";
import {UpcomingProvider} from "../../providers/upcoming/upcoming";
import {postCategory} from "../../config";
//import { IonicImageLoader } from 'ionic-image-loader';
import * as moment from 'moment'
import Parse from "parse";



/**
 * Generated class for the UpcomingCardComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'upcoming-card',
    templateUrl: 'upcoming-card.html'
})
export class UpcomingCardComponent {
    @Input() item: any;

    username: any;
    loadingLike: boolean = false;
    loaded: boolean = false; 

    constructor(private provider: UpcomingProvider,
        private navCtrl: NavController,
        private modalCtrl: ModalController,
        private popoverCtrl: PopoverController,
        private app: App
    ) {
        this.username = Parse.User.current().get('username');
    }

    getCode(code:string) {
        //console.log(code)
        return code.trim();
    }
    getCategory(codeId) {
        //var fitter = postCategory.filter(item => item.id == codeId)[0]
        //console.log(fitter)
        //return fitter.cat;
        return "Birthday"
    }


    isPastEvent(e: any): Boolean {

        let ispast: boolean;
        let today = moment(new Date())//.format('MM-DD-YYYY');
        let enddate = moment(e)//.format('MM-DD-YYYY');
        if (moment(today).isAfter(enddate)) {
            ispast = true;
        } 
        return ispast;
    }

    openPopover(ev): void {
        this.popoverCtrl.create('UpcomingListPopoverPage', { item: this.item }).present({ ev: ev });
    }

    sharePhoto(item): void {
        //item['image']
        //this.modalCtrl.create('ChatSharePhotoPage', { image: item.obj, type: 'upcoming', typeId: item.id }).present();
        this.modalCtrl.create('ChatSharePhotoPage', { image: item['image'], type: 'upcoming', typeId: item.id }).present();
    }

    openComments(item): void {
        let modal = this.modalCtrl.create('UpcomingCommentModalPage', { galleryId: item.id });//.present();
        modal.onDidDismiss(() => {
            this.provider.get(item.id).then(upcoming => {
                if (upcoming) {
                    item.comments = upcoming.comments;
                    console.log(item.comments)
                }
            });
        });
        modal.present()
    }

    openProfile(username: string): void {
        this.app.getRootNav().push('ProfilePage', { username: username })
    }

    openAlbum(item): void {
        this.app.getRootNav().push('AlbumPhotoGridPage', { id: item.id });
    }
    openPhoto(item) {
        //this.app.getRootNav().push('UpcomingPhotoPage', { id: item.id, item: item });
        let modal = this.modalCtrl.create('ModalUpcomingPost',
            { // Send data to modal
                id: item.id, item: item
            }, // This data comes from API!
            {
                showBackdrop: true,
                enableBackdropDismiss: true,
                enterAnimation: 'modal-scale-up-enter',
                leaveAnimation: 'modal-scale-up-leave'
            });

        modal.present();
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
        });
    }

    onBookmark(item): void {
        item.loadingBookmark = true;
        this.provider.bookmarkUpcoming(item.id).then(data => {
            item.isBookmark = !item.isBookmark;
            item.loadingBookmark = false;
        });
    }

    onSelectCategory(category: string) {
        this.app.getRootNav().push('CategoryPage', { category: category })
    }
    onSelectCountryCategory(country_city: string, type: any) {
        this.app.getRootNav().push('CategoryPage', { country_city: country_city, type: type })
    }
    onSelectDateCategory(category: string) {
        this.app.getRootNav().push('CategoryPage', { categorydate: moment(category).format("DD-MMM-YYYY")  })
    }

}
