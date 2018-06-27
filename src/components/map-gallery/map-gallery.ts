import {Component, ElementRef, ViewChild} from "@angular/core";
import {NavController, App, ModalController} from "ionic-angular";
import {IonicUtilProvider} from "../../providers/ionic-util/ionic-util";
import {GalleryProvider} from "../../providers/gallery/gallery";
import {UpcomingProvider} from "../../providers/upcoming/upcoming";

import {IParamsLocation} from "../../models/parse.params.location.model";
import _ from "underscore";
import {AnalyticsProvider} from "../../providers/analytics/analytics";
import {GmapProvider} from "../../providers/gmap/gmap";

import Parse from "parse";
declare const google: any;

@Component({
    selector: 'map-gallery',
    templateUrl: 'map-gallery.html'
})
export class MapGalleryComponent {

    @ViewChild('map') mapElement: ElementRef;


    map: any;
    mapInitialised: boolean = false;
    isErrorMap: boolean = false;
    params: IParamsLocation = {
        location: null,
        distance: 100
    };

    loading: boolean = true;
    markers: any = [];
    userAddress: any;


    constructor(private util: IonicUtilProvider,
        private provider: GalleryProvider,
        private providerUpcoming: UpcomingProvider,
        private navCtrl: NavController,
        private gmap: GmapProvider,
        private analytics: AnalyticsProvider,
        private app: App,
        private modalCtrl: ModalController, ) {
        // Google Analytics
        this.analytics.view('TabSearchMapPage');


    }

    ngAfterViewInit() {
        console.log('google', window)
        if (window['google']) {
            this.initMap();
        } else {
            setTimeout(() => {
                this.isErrorMap = true;
                this.util.translate('Check your connection, map unavailable').then((res: string) => this.util.toast(res));
                //this.util.toast('Verifique sua conexão, mapa indisponível')
            }, 1000)
        }
    }


    initMap() {

        this.mapInitialised = true;

        let latLng = this.position(-34.9290, 138.6010);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        // Load Google Maps
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        // Load my position
        this.onMyPosition();

        //On Map Listener event
        google.maps.event.addListener(this.map, 'idle', () => this.onNear());

    }

    onMyPosition() {
        // Get Current Location
        this.gmap.getLocation()
            .then((address: any) => {
                this.userAddress = address;
                let latLng = this.position(address.geo.latitude, address.geo.longitude);
                this.params.location = new Parse.GeoPoint(address.geo.latitude, address.geo.longitude);

                let myLocation = {
                    position: latLng,
                    title: 'Position',
                    id: 0
                };

                setTimeout(() => {
                    this.addMarker(myLocation);
                    this.map.setCenter(myLocation.position);
                }, 1000);

            }, (err) => {
                console.log(err);
            });
    }

    openPhoto(item: any): void {
        //console.log(item)
        if (item.className == 'Gallery') {
            this.app.getRootNav().push('PhotoPage', { id: item.id });
            //this.app.getRootNav().push('PhotoPage', { id: item.id, item: item });
            //let modal = this.modalCtrl.create('ModalPost',
            //    { // Send data to modal
            //        id: item.id, item: item
            //    }, // This data comes from API!
            //    { showBackdrop: true, enableBackdropDismiss: true });

            //modal.present();
        }
        if (item.className == 'Upcoming') {
            this.app.getRootNav().push('UpcomingPhotoPage', { id: item.id });
            //this.app.getRootNav().push('UpcomingPhotoPage', { id: item.id, item: item });
        }
    }


    position(latitude: number, longitude: number): any {
        return new google.maps.LatLng(latitude, longitude);
    }

    addMarker(item) {
        let marker = new google.maps.Marker({
            id: item.id,
            position: item.position,
            title: item.title,
            map: this.map,
            animation: google.maps.Animation.DROP,
        });
        //console.log('addMaker', marker);
        this.markers.push(marker);
        if (item.id) {
            google.maps.event.addListener(marker, 'click', () => this.openPhoto(item));
        }
    }

    addInfoWindow(marker, content) {
        let infoWindow = new google.maps.InfoWindow({ content: content });
        google.maps.event.addListener(marker, 'click', () => infoWindow.open(this.map, marker));
    }

    setGallerys(data) {
       
        data.map((item) => {
            let upcomingLocation = {
                lat: item.location.latitude,
                lng: item.location.longitude
            };
            let size = 40;
            let marker = new google.maps.Marker({
                map: this.map,
                id: item.id,
                position: this.position(item.location.latitude, item.location.longitude),
                title: item.title,
                image: item.image.url(),
                icon: {
                    url: item.imageThumb.url(),
                    size: new google.maps.Size(size, size),
                    scaledSize: new google.maps.Size(size, size),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(size / 4, size / 4),
                },
                username: item.attributes.user.attributes.username
               // distance: this.applyHaversine(upcomingLocation)
            });
            //console.log(this.applyHaversine(upcomingLocation));

            if (!_.some(this.markers, item.id)) {
                google.maps.event.addListener(marker, 'click', () => this.openPhoto(item));
                this.markers.push(marker);
            }
        });
    }

    onNear() {
        var arrayUpcoming = []
        var cancatArray = [];
        this.mapElement.nativeElement.classList.add('show-map');
        this.params.location = new Parse.GeoPoint({ latitude: this.map.center.lat(), longitude: this.map.center.lng() });
        console.log(this.params);

        this.providerUpcoming.near(this.params).then(data => {
            if (data && data.length) {
                arrayUpcoming = data;
            }
            this.provider.near(this.params).then(data => {

                if (data || arrayUpcoming) {
                    if (data.length) {
                        cancatArray = arrayUpcoming.concat(data);
                        //console.log();
                        this.setGallerys(cancatArray);
                    } else if (arrayUpcoming.length) {
                        this.setGallerys(arrayUpcoming);
                    }
                    //this.setGallerys(data);
                }
                this.loading = false;
            }).catch(error => {
                console.log(error);
                this.util.toast(error);
            });

        }).catch(error => {
            console.log(error);
            this.util.toast(error);
        });

        //this.provider.near(this.params).then(data => {
        //  console.log(data);
        //  if (data && data.length) {
        //    //data.map(item => this.data.push(item));
        //    this.setGallerys(data);
        //  }
        //  this.loading = false;
        //}).catch(error => {
        //  console.log(error);
        //  this.util.toast(error);
        //});
    }

    getMyLocation() {
        return new Parse.GeoPoint({ latitude: this.map.center.lat(), longitude: this.map.center.lng() });
    }

    load() {

        //this.data = this.applyHaversine(data.locations);
        //this.data.sort((locationA, locationB) => locationA.distance - locationB.distance);

    }

    applyHaversine(locations) {
     
        let usersLocation = {
            lat: this.userAddress.geo.latitude,
            lng: this.userAddress.geo.longitude
        };

        locations.map((location) => {

            let placeLocation = {
                lat: location.latitude,
                lng: location.longitude
            };

            location.distance = this.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'miles'
            ).toFixed(2);
        });

        return locations;
    }

    getDistanceBetweenPoints(start, end, units) {

        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;

    }

    toRad(x) {
        return x * Math.PI / 180;
    }

}
