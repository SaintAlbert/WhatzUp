import {Component, ViewChild} from "@angular/core";
import {Events, Content,NavParams, IonicPage} from "ionic-angular";
import {IParams} from "../../models/parse.params.model";
import {AnalyticsProvider} from "../../providers/analytics/analytics";

@IonicPage()
@Component({
        selector: 'page-category',
        templateUrl: 'category.html',
})
export class CategoryPage {
    @ViewChild(Content) content: Content;
    eventName: string = 'category';
    loading: boolean = true;
    moreItem: boolean = true;
    title: string
    eventTitle:string=''

    params: IParams = {
        limit: 12,
        page: 1,
        privacity: 'public',
        category: null,
        categorydate:null,
        country_city: null,
        type:0
    };
    constructor(
        private events: Events,
        private navParams: NavParams,
        private analytics: AnalyticsProvider ) {
        // Google Analytics
        this.analytics.view('CategoryPage');

       
        if (this.navParams.get('category')) {
            this.params.country_city = null;
            this.title = this.navParams.get('category');
            this.params.category = this.navParams.get('category');
            this.eventTitle = this.title;
            this.params.categorydate = null;
        }
        if (this.navParams.get('categorydate')) {
            console.log(this.navParams.get('categorydate'))
            this.params.category = null
            this.params.country_city = null;
            this.title = this.navParams.get('categorydate');
            this.params.categorydate = this.navParams.get('categorydate');
            this.eventTitle = this.title.toString();
        }

        if (this.navParams.get('country_city')) {
            this.title = this.navParams.get('country_city');
            this.params.country_city = this.navParams.get('country_city');
            this.params.type = this.navParams.get('type');
            this.params.category = null
            this.params.categorydate = null;
        }
       
        
     
    }
    ionViewDidLoad() {
        this.events.unsubscribe(this.eventName + ':complete');
        this.sendParams();
    }

    ionViewWillEnter() {
        //console.info('ionViewWillEnter home');
        // More Item
        this.events.subscribe(this.eventName + ':moreItem', moreItem => this.moreItem = moreItem);
        this.events.subscribe('scroll:up', () => this.scrollTop());

    }

    public doInfinite(event) {
        this.params.page++;
        this.events.unsubscribe(this.eventName + ':complete');
        this.events.subscribe(this.eventName + ':complete', () => event.complete());
        this.sendParams();
    }

    public doRefresh(event?) {
        if (event) {
            event.complete();
        }
        this.params.page = 1;
        this.events.publish(this.eventName + ':reload', this.params);
      
    }
    scrollTop() {
        if (this.content._scroll) {
            this.content.scrollToTop(1000);
        }
    }
    private sendParams(): void {
        console.log('sendParams', this.params);
        this.events.publish(this.eventName + ':params', this.params);
    }


  

 

}
