import {Component, NgZone, Input, Renderer, ElementRef, ViewChild, OnChanges} from "@angular/core";
import {App, Events, ModalController, VirtualScroll } from "ionic-angular";
import _ from "underscore";
import {IParams} from "../../models/parse.params.model";
import {UpcomingProvider} from "../../providers/upcoming/upcoming";
import {UserProvider} from "../../providers/user/user";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import Parse from "parse";
import { VirtualScrollComponent } from '../../components/virtual-scroll-component/virtual-scroll-component';
import { Observable } from 'rxjs';
import * as moment from 'moment'
/**
 * Generated class for the UpcomingListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'upcoming-list',
    templateUrl: 'upcoming-list.html'
})
export class UpcomingListComponent implements OnChanges {

    @Input() username?: string;
    @Input() event: string;
    @Input() item: any;

    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;

    moreItem: boolean = false;
    params: IParams = {
        limit: 5,
        page: 1
    };
    indices: any;
    errorIcon: string = 'ios-images-outline';
    errorText: string = '';
    loading: boolean = true;
    showEmptyView: boolean = false;
    showErrorView: boolean = false;
    data = [];



    constructor(private renderer: Renderer,
        private provider: UpcomingProvider,
        private events: Events,
        private User: UserProvider,
        private app: App,
        private util: IonicUtilProvider,
        private modalCtrl: ModalController,
        private zone: NgZone
    ) {

    }

    ngOnInit() {
        // Cache Request
        console.log(this.event)
        this.events.subscribe(this.event + ':cache', (params: IParams) => {
            console.info(this.event + ':cache', params);
            this.params = params;
            this.cache()
            this.updateVitualSroll()
            //.then(() => { this.updateVitualSroll(); });
        });

        // Server Request
        this.events.subscribe(this.event + ':params', (params: IParams) => {
            console.info(this.event + ':params', params);
            this.params = params;
            this.feed()
                .then(() => { this.updateVitualSroll(); });
        });

        this.events.subscribe('upcoming-list:reload', (params) => {
            console.warn('event-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                if (this.params.page)
                    this.params.page = 1;
                //this.params.page = 1;
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

        //// Reload
        this.events.subscribe('upcoming-list-edit:reload', (params: IParams) => {
            console.warn('event-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                if (this.params.page)
                    this.params.page = 1;
                //this.params.page = 1;
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

        ////BookMark_Like_Load
        //this.events.subscribe('upcoming-list-edit:reload', (params) => {
        //    console.warn('event-list', this.event + ':reload', params);
        //    if (params) {
        //        this.params = params;
        //    } else {
        //        this.params.page = 1;
        //    }
        //    this.data = []
        //    // Clean Cache and Reload

        //    this.feed()
        //        .then(() => this.events.publish('scroll:up'))
        //        .catch(console.error);
        //    ;
        //});

        // Reload//upcominglist
        this.events.subscribe(this.event + ':reload', (params) => {
            console.warn('upcoming-list', this.event + ':reload', params);
            if (params) {
                this.params = params;
            } else {
                if (this.params.page)
                    this.params.page = 1;
            }
            //this.params.page = 1;

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
    }

    ngOnDestroy() {
        this.events.unsubscribe('upcoming-list-edit:reload');
        this.events.unsubscribe(this.event + ':reload');
        this.events.unsubscribe(this.event + ':params');
        this.events.unsubscribe('albumgrid:reload');
        this.events.unsubscribe('albumgrid:destroy');
    }


    feed(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                //console.log(this.params);
                //this.params.limit = 5;
                if (this.params.page == 1) {
                    this.data = [];
                    this.loading = true;
                }

                this.provider.feed(this.params).then(data => {
                    // console.log(data);
                    if (data) {
                        this.showErrorView = false;
                        this.showEmptyView = false;
                        //_.sortBy(data, 'startDate').reverse().map(item => this.data.push(item));
                        _.sortBy(data, 'startDate').map(item =>
                            this.data.push(item)
                        );
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
                    console.log(data)

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
                //_.sortBy(_data, 'createdAt').reverse().map(item => this.data.push(item));
                _.sortBy(_data, 'startDate').map(item => this.data.push(item));
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
        console.log(event)
        this.params.page++;
        this.events.unsubscribe(this.event + ':complete');
        this.events.subscribe(this.event + ':complete', () => event.complete());

        this.sendParams();

    }
    private sendParams(): void {
        this.events.publish(this.event + ':params', this.params);
    }

    onSelectDateCategory(category: string) {
        this.app.getRootNav().push('CategoryPage', { categorydate: moment(category).format("DD-MMM-YYYY") })
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
