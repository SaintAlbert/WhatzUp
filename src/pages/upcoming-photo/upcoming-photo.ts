import {Component, ViewChild} from "@angular/core";
import {IonicPage, Events, NavParams, Navbar, Content, NavController, PopoverController, ModalController} from "ionic-angular";
import {UpcomingProvider} from "../../providers/upcoming/upcoming";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {postCategory} from "../../config";

@IonicPage()
@Component({
        selector: 'upcoming-photo',
  templateUrl: 'upcoming-photo.html'
})
export class UpcomingPhotoPage {
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild(Content) content: Content;
  item: any;
  id: any;
  loading: boolean = true;
  upcoming: any = {};
  hide: boolean = false;

  constructor(private navParams: NavParams,
      private navController: NavController,
      private provider: UpcomingProvider,
      private modalCtrl: ModalController,
      private analytics: AnalyticsProvider,
      private popoverCtrl: PopoverController,
      private events: Events
  ) {
    // Google Analytics
    this.analytics.view('UpcomingPhotoPage');
    this.id = this.navParams.get('id');

    this.load();

  }
  goBack() {
      this.navController.pop();
  }
 
  load() {
      this.loading = true;
      if (this.navParams.get('item')) {
          this.item = this.navParams.get('item');
          this.upcoming = this.navParams.get('item');
          //console.log('upcoming', this.upcoming);
          this.loading = false;
      }
   
    this.provider.get(this.id).then(upcoming => {
        console.log('upcoming', upcoming);
        this.item = upcoming;
        this.upcoming = upcoming;
        this.loading = false;
        this.content.resize();
    });
  }

  //goBack() {
  //    this.navBar.backButtonClick = (e: UIEvent) => {
  //        // todo something
  //        this.navController.pop();
  //    }
  //}

  getCategory(codeId) {
      //var fitter = postCategory.filter(item => item.id == codeId)[0]
      ////console.log(fitter.cat)
      //if(fitter)
      //return fitter.cat;
      return "Birthday"
  }

  openPopover(ev): void {
      this.popoverCtrl.create('UpcomingListPopoverPage', { item: this.item }).present({ ev: ev });
  }
  sharePhoto(item): void {
      console.log(item)
      // this.modalCtrl.create('ChatSharePhotoPage', { image: item.obj }).present();
      this.modalCtrl.create('ChatSharePhotoPage', { image: item['image'], type: 'upcoming', typeId: item.id }).present();
  }

  openComments(item): void {
      //this.modalCtrl.create('UpcomingCommentModalPage', { galleryId: item.id }).present()
      let modal = this.modalCtrl.create('UpcomingCommentModalPage', { galleryId: item.id });//.present();
      modal.onDidDismiss(() => {
          this.provider.get(item.id).then(upcoming => {
              if (upcoming) {
                  
                  this.events.publish('upcomingComentUpdate',null);
                  item.comments = upcoming.comments;
                  //console.log(item.comments)
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

  openProfile(username: string): void {
      this.navController.push('ProfilePage', { username: username })
  }
  ionViewWillLeave() {
      this.hide = true;
  }
  ionViewWillEnter() {
     // this.hide = false;
         this.loading = true;
         if (this.navParams.get('item'))
         {
             //console.log("Philip "+this.navParams.get('item'))
          this.item = this.navParams.get('item');
          this.upcoming = this.navParams.get('item');
          //console.log('upcoming', this.upcoming);
          this.loading = false;
          this.content.resize();
      }
   
  }





}
