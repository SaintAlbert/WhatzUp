import {Component, HostListener, ViewChild, ElementRef} from '@angular/core';
import {NavParams, Content, ViewController, IonicPage} from "ionic-angular";
import {GalleryCommentProvider} from "../../providers/gallery-comment/gallery-comment";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {GalleryProvider} from "../../providers/gallery/gallery";
import _ from "underscore";
import {AnalyticsProvider} from "../../providers/analytics/analytics";


import Parse from "parse";

declare const $: any;

@IonicPage()
@Component({
  selector   : 'photo-comment-modal',
  templateUrl: 'photo-comment-modal.html'
})
export class PhotoCommentModalPage {
  @ViewChild(Content) content: Content;
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLTextAreaElement): void {
      this.adjust();
  }
  @ViewChild('textmsgId') element: ElementRef;

  errorIcon: string      = 'ios-text-outline';
  errorText: string      = '';
  data                   = [];
  loading: boolean       = false;
  showEmptyView: boolean = false;
  showErrorView: boolean = false;
  moreItem: boolean      = false;
  query: any;
  sending                = false
  gallery: any;
  form: any;
  galleryId: string;
  user: any;

  params = {
    limit    : 20,
    page     : 1,
    galleryId: null
  };

  constructor(private navparams: NavParams,
              private viewCtrl: ViewController,
              private provider: GalleryCommentProvider,
              private util: IonicUtilProvider,
              private Gallery: GalleryProvider,
              private analytics: AnalyticsProvider) {
    // Google Analytics
    this.analytics.view('PhotoCommentModalPage');

    this.form = {
      text: ''
    };

    this.user = Parse.User.current();

    this.galleryId        = this.navparams.data.galleryId;
    // More Item
    this.params.galleryId = this.galleryId;
    this.onGallery(this.galleryId);

  }

  adjust(): void {
      this.element.nativeElement.style.overflow = 'hidden';
      //this.element.nativeElement.style.position = 'relative'
      this.element.nativeElement.style.height = 'auto';
      this.element.nativeElement.style.height = this.element.nativeElement.scrollHeight + "px";
  }

  onAddMessage(message) {
    if (message) {
      let item = this.parseItem(message);
      this.data.push(item);
      this.scrollToBottom();

    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
        if (this.content._scroll) {
        this.content.scrollToBottom(300)
      }
    }, 100);
  }

  // keep the input focused.
  // for some reason it works best if this is separate from the send function
  blurInput(e) {
    //console.log(e);
    if (!this.sending) {
      return;
    }
    setTimeout(() => {
      $('#messageBox input').focus();
    }, 10);
    setTimeout(() => {
      $('#messageBox input').focus();
    }, 1);
    $('#messageBox input').focus();
  }

  onGallery(galleryId: string) {
    this.loading = true;
    this.Gallery.getParse(galleryId).then(gallery => {
      this.form.gallery = gallery;

      let ParseObject = Parse.Object.extend('GalleryComment');
      this.query      = new Parse.Query(ParseObject)
        .include(['profile', 'user'])
        .descending('createdAt')
        .limit(100)
        .descending('createdAt')
        .equalTo('gallery', gallery);

      this.query
        .subscribe()
        .on('open', () => console.info('subscription opened'))
        .on('create', message => this.onAddMessage(message))
        .on('update', (object) => console.info('object update', object))
        .on('leave', (object) => console.info('object leave', object))
        .on('delete', object => console.info('delete', object))
        .on('close', (object) => console.info('subscription close', object))


      this.doRefresh();
    }).catch(this.onError)
    ;
  }

  onError(error) {
    this.util.toast('Error');
    this.loading       = false;
    this.showErrorView = true;
  }

  doRefresh() {
    this.query.find().then(data => {
      if (data) {
        this.data          = this.parseData(data);
        this.showErrorView = false;
        this.showEmptyView = false;
        this.moreItem      = true;
      } else {
        this.showEmptyView = true;
        this.moreItem      = false;
      }

      this.loading = false;
      this.scrollToBottom();

    }).catch(this.onError)
  }

  parseData(data: any[]): any[] {
    return _.sortBy(data, 'createdAt').map(item => this.parseItem(item));
  }

  parseItem(item) {
    item.photo = item.get('profile').get('photo') ? item.get('profile').get('photo').url() : 'assets/img/user.png'
    item.class = item.get('user').id === this.user.id ? 'right' : 'left';
    return item;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onComment(form) {
    if (form.valid) {
      this.provider.create(this.form).then(() => {
        this.form.text = '';
      });
    }
  }
}
