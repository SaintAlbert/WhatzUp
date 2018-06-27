import {Component, NgZone , Input, OnInit, ViewChild} from "@angular/core";
import {App, Events, ModalController} from "ionic-angular";
import _ from "underscore";
import {IParams} from "../../models/parse.params.model";
import {GalleryProvider} from "../../providers/gallery/gallery";
import {UserProvider} from "../../providers/user/user";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import { VirtualScrollComponent } from '../../components/virtual-scroll-component/virtual-scroll-component';
import Parse from "parse";
@Component({
    selector: 'photo-list',
    templateUrl: 'photo-list.html'
})
export class PhotoListComponent implements OnInit {

    @Input() username?: string;
    @Input() event: string;
    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;

    params: IParams = {
        limit: 5,
        page: 1
    };

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data = [];
    moreItem = false;

    //moreItem: boolean = false;
    constructor(private provider: GalleryProvider,
        private events: Events,
        private User: UserProvider,
        private app: App,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
        private zone: NgZone) {

    }

    ngOnInit() {

        // Cache Request
        this.events.subscribe(this.event + ':cache', (params: IParams) => {
            console.info(this.event + ':cache', params);
            this.params = params;
            this.cache();
            this.updateVitualSroll()
        });

        // Server Request
        this.events.subscribe(this.event + ':params', (params: IParams) => {
            console.info(this.event + ':params', params);
            this.params = params;
            this.feed()
                .then(() => {
                    this.updateVitualSroll();
                   // this.events.publish('scroll:up')
                })
        });

        // Reload
        this.events.subscribe(this.event + ':reload', (params) => {
            //console.warn('photo-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                if (this.params.page) 
                this.params.page = 1;
            }
            this.data = []
            // Clean Cache and Reload
            this.feed()
                .then(() => {
                    this.updateVitualSroll();
                    this.events.publish('scroll:up')
                })
                .catch(console.error);
            ;
        });

        // Reload
        this.events.subscribe('photolist:reload', (params) => {
            //console.warn('photo-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                if (this.params.page) 
                    this.params.page = 1;
                }
                this.data = []
                // Clean Cache and Reload
                this.feed()
                    .then(() => {
                        this.updateVitualSroll();
                        this.events.publish('scroll:up')
                    })
                    .catch(console.error);
                ;
        });

        // Reload
        this.events.subscribe('photolistmodal:contentupdate', (item) => {
            this.loading = false;
            for (var i in this.data) {
                if (this.data[i].id == item.id) {
                   
                    this.data[i].isBookmark = item.isBookmark;
                    this.data[i].isLiked = item.isLiked;
                    this.data[i].loadingBookmark = item.loadingBookmark;
                    this.data[i].isBookmark = item.isBookmark;
                    this.data[i].loadingLike = item.loadingLike;
                    //this.data[i].comments= item.comments;
                    //this.data[i].commentsTotal = item.comments.length;
                    //console.log(this.data[i].commentsTotal);
                    break; //Stop this loop, we found it!
                }
            }
        });
    }





    ngOnDestroy() {
        this.events.unsubscribe(this.event + ':reload');
        this.events.unsubscribe(this.event + ':params');
        this.events.unsubscribe('albumgrid:reload');
        this.events.unsubscribe('albumgrid:destroy');
    }


    feed(): Promise<any> {
        
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                //console.log(this.params);
                if (this.params.page == 1) {
                    this.data = [];
                    this.loading = true;
                }

                this.provider.feed(this.params).then(data => {
                    // console.log(data);
                    if (data) {
                        this.showErrorView = false;
                        this.showEmptyView = false;
                        _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
                        this.events.publish(this.event + ':moreItem', true);
                        this.moreItem = true;
                    }

                    if (!this.data.length) {
                        this.showEmptyView = true;
                        this.events.publish(this.event + ':moreItem', true);
                        this.moreItem = true;
                    }

                    this.loading = false;
                    this.events.publish(this.event + ':complete', null);
                    resolve(data);
                }).catch(error => {

                    if (error.code == Parse.Error['INVALID_SESSION_TOKEN']) {
                        this.User.logout();
                        this.app.getRootNav().setRoot('IntroPage');
                        this.util.toast('Invalid session, please login');
                    }

                    this.errorText = error.message;
                    this.showErrorView = true;
                    this.loading = false;
                    this.events.publish(this.event + ':complete', null);
                    reject(error);
                });
            });
        });
    }


    cache(): void {
        console.log('Load cache', this.params);
        this.provider.feed(this.params).then(_data => {
            console.log('cache', _data);
            if (_data.length) {
                _.sortBy(_data, 'createdAt').reverse().map(item => this.data.push(item));
                this.loading = false;
                this.events.publish(this.event + ':moreItem', true);
                this.moreItem = true;
            } else {
                this.feed().then(() => this.updateVitualSroll());
            }
        });
    }

    public doTry(): void {
        this.showErrorView = false;
        this.feed().then(() => this.updateVitualSroll());
    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.event + ':complete');
        this.events.subscribe(this.event + ':complete', () => event.complete());

        this.sendParams();

    }
    private sendParams(): void {
        this.events.publish(this.event + ':params', this.params);

    }

    public updateVitualSroll() {
      
        //this.virtualScroll.refresh();
        //setTimeout(() => {
        //    this.virtualScroll.refresh(true);
        //}, 100)

    }

    ngOnChanges() {
        this.updateVitualSroll();
    }


    ngAfterViewInit() {
        //setTimeout(() => {
        //    this.virtualScroll.refresh(true);
        //}, 500)
    }




}
