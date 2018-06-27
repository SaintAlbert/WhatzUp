import {Component, Input} from "@angular/core";
import {ModalController, PopoverController, App, NavController, Events} from "ionic-angular";
import {GalleryProvider} from "../../providers/gallery/gallery";
//import {ModalPost} from "../../pages/modal-post/modal-post";
//import { ImageViewerController } from "ionic-img-viewer";

import Parse from "parse";

@Component({
  selector   : 'photo-card',
  templateUrl: 'photo-card.html'
})
export class PhotoCardComponent {

  @Input() item: any;

  username: any;
  loadingLike: boolean = false;
  loaded: boolean = false; 
  constructor(private provider: GalleryProvider,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private popoverCtrl: PopoverController,
              private app: App,
              private events: Events,
              //public imageViewerCtrl: ImageViewerController
         
  ) {
    this.username = Parse.User.current().get('username');
  }

  openPopover(ev):void {
    this.popoverCtrl.create('PhotoListPopoverPage', {item: this.item}).present({ev: ev});
  }

  sharePhoto(item):void {
    //this.modalCtrl.create('ChatSharePhotoPage', {image: item.obj}).present();
      this.modalCtrl.create('ChatSharePhotoPage', { image: item['image'], type: 'photo', typeId: item.id }).present();
  }

  openComments(item):void {
      //this.modalCtrl.create('PhotoCommentModalPage', { galleryId: item.id }).present();
      let modal = this.modalCtrl.create('PhotoCommentModalPage', { galleryId: item.id });//.present();
      modal.onDidDismiss(() => {
          this.provider.get(item.id).then(gal => {
              if (gal) {
                  item.comments = gal.comments;
              }
          });
      });
      modal.present()
  }

  openProfile(username: string):void {
      this.app.getRootNav().push('ProfilePage', { username: username })
  }

  openAlbum(item): void {
      this.app.getRootNav().push('AlbumPhotoGridPage', { id: item.id });
  }

  openPhoto(item) {
      //this.app.getRootNav().push('PhotoPage', { id: item.id, item: item });
      let modal = this.modalCtrl.create('ModalPost',
          { // Send data to modal
              id: item.id, item: item, hideHeader: true
          }, // This data comes from API!
          {
              showBackdrop: true, enableBackdropDismiss: true
          });
     
      modal.present();
  }

  onLike(item):void {
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

    });
  }

  onBookmark(item):void {
    item.loadingBookmark = true;
    this.provider.bookmarkGallery(item.id).then(data=>{
      item.isBookmark = !item.isBookmark;
      item.loadingBookmark = false;
    });
  }

}
