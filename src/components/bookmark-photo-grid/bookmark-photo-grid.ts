import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {NavController, App, Events, ModalController} from "ionic-angular";
import _ from "underscore";
import {GalleryProvider} from "../../providers/gallery/gallery";
import {UpcomingProvider} from "../../providers/upcoming/upcoming";
import {IParams} from "../../models/parse.params.model";
import {PhotoPage} from "../../pages/photo/photo";
import {UpcomingPhotoPage} from "../../pages/upcoming-photo/upcoming-photo";
import { VirtualScrollComponent } from '../../components/virtual-scroll-component/virtual-scroll-component';

@Component({
    selector: 'bookmark-photo-grid',
    templateUrl: 'bookmark-photo-grid.html'
})
export class BookmarkPhotoGridComponent implements OnInit {

    @Input() username?: string;
    @Input() event: string;
    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;

    params: IParams = {
        limit: 15,
        page: 1,
        username: null
    };

    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data = [];

    constructor(private provider: GalleryProvider,
        private upcoming: UpcomingProvider,
        private events: Events,
        private nav: NavController,
        private app: App,
        private modalCtrl: ModalController,
    ) {
        this.params = {
            limit: 15,
            page: 1,
            username: null
        };
    }

    ngOnInit() {
        // Cache Request
        this.events.subscribe(this.event + ':cache', (params: IParams) => {
            console.warn('photo-grid', this.event + ':cache', params);
            this.params = params;
            this.cache();
            this.updateVitualSroll();
        });

        // Server Request
        this.events.subscribe(this.event + ':params', (params: IParams) => {
            console.warn('photo-grid', this.event + ':params', params);
            this.params = params;
            this.feed()
                .then(() => {
                    this.updateVitualSroll();
                    this.events.publish('scroll:up')
                })
        });

        // Reload
        this.events.subscribe(this.event + ':reload', (params: IParams) => {
            console.warn('photo-grid-bookmark', this.event + ':reload');
            this.params = params;
            this.data = []
            // Clean Cache and Reload
            this.feed()
                .then(() => {
                    this.updateVitualSroll();
                    this.events.publish('scroll:up')
                })
                //.then(() => this.events.publish('scroll:up'))
                .catch(console.error);
            ;
        });

        this.events.subscribe('photo-grid-bookmark:reload', (params: IParams) => {
            console.warn('photo-grid-bookmark:reload', this.event + ':reload');
            this.params = params;
            this.data = []
            // Clean Cache and Reload
            this.feed()
                //.then(() => this.events.publish('scroll:up'))
                .then(() => {
                    this.updateVitualSroll();
                    this.events.publish('scroll:up')
                })
                .catch(console.error);
            ;
        });
    }

    openPhoto(item): void {
        //this.nav.push(PhotoPage, { id: item.id });
        let modal = this.modalCtrl.create('ModalPost',
            { // Send data to modal
                id: item.id, item: item
            }, // This data comes from API!
            { showBackdrop: true, enableBackdropDismiss: true });

        modal.present();
    }
    openUpcomingPhoto(item): void {
        this.app.getRootNav().push('UpcomingPhotoPage', { id: item.id });
    }

    private feed(): Promise<any> {

        return new Promise((resolve, reject) => {
            let margeBookmark = [];
            let data=[]
            if (this.params.page == 1) {
                this.data = [];
                this.loading = true;
            }

            this.upcoming.feedBookmarkUpcoming(this.params).then(upcomingdata => {
                margeBookmark = upcomingdata;
                    //console.log(margeBookmark)
                console.log('-----feed', this.params);
                this.provider.feedBookmarkGallery(this.params).then(galarydata => {
                    if (margeBookmark) {
                        data = galarydata.concat(margeBookmark);
                        console.log(data)
                        //console.log(margeBookmark)
                    } else {
                        data = galarydata;
                    }
                  
                    if (data) {
                        this.showErrorView = false;
                        this.showEmptyView = false;
                        _.sortBy(data, 'createdAt').reverse().map(item => this.data.push(item));
                        this.events.publish(this.event + ':moreItem', true);
                    }

                    if (!this.data.length) {
                        this.showEmptyView = true;
                        this.events.publish(this.event + ':moreItem', true);
                    }

                    this.loading = false;
                    this.events.publish(this.event + ':complete', null);
                    resolve(data);
                }).catch(error => {
                    this.errorText = error.message;
                    this.showErrorView = true;
                    this.loading = false;
                    this.events.publish(this.event + ':complete', null);
                    reject(error);
                });

            }).catch(error => {
                this.errorText = error.message;
                this.showErrorView = true;
                this.loading = false;
                this.events.publish(this.event + ':complete', null);
                reject(error);
            });
        });
    }

    private cache(): void {
        console.log('Load cache', this.params);
        this.provider.feed(this.params).then(_data => {
            console.log('cache', _data);
            if (_data.length) {
                _.sortBy(_data, 'createdAt').reverse().map(item => this.data.push(item));
                this.loading = false;
                this.events.publish(this.event + ':moreItem', true);
            } else {
                this.feed().then(() => this.updateVitualSroll());
            }
        });
    }

    public doTry(): void {
        this.showErrorView = false;
        this.feed().then(() => this.updateVitualSroll());
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
