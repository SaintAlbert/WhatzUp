import {Injectable} from "@angular/core";
import {Geolocation} from "@ionic-native/geolocation";
import {Events, Platform} from "ionic-angular";
import {GOOGLE_MAPS_WEB} from "../../config";
import {IonicUtilProvider} from "../ionic-util/ionic-util";
import {LocalStorageProvider} from "../local-storage/local-storage";
import Parse from "parse";
declare const google: any;
declare const window: any;

@Injectable()
export class GmapProvider {

  _data: any;
  _service: any;
  _geocoder: any;
  coords: any;
  address: any;

  loading: boolean = true;

  componentForm     = {
    street_number              : 'long_name',
    //number
    route                      : 'long_name',
    //street
    locality                   : 'long_name',
    // district
    sublocality                : 'long_name',
    // district
    neighborhood               : 'long_name',
    //state
    political                  : 'long_name',
    //state
    administrative_area_level_1: 'long_name',
    //state
    country                    : 'long_name',
    //country
    postal_code                : 'long_name' //zipcode
  };
  componentFormName = {
    street_number              : 'number',
    //number
    route                      : 'street',
    //state
    political                  : 'district',
    //street
    locality                   : 'city',
    // district
    administrative_area_level_1: 'state',
    //state
    country                    : 'country',
    //country
    postal_code                : 'zipcode',
    //zipcode
    neighborhood               : 'district' //zipcode
  };
  autocomplete      = {
    query: ''
  };

  mapInitialised: boolean = false;

  constructor(private util: IonicUtilProvider,
              private events: Events,
              private Geolocation: Geolocation,
              private storage: LocalStorageProvider,
              private platform: Platform) {

  }

   
  addConnectivityListeners(): void {
      
    let onOnline = () => {
      setTimeout(() => {
        if (typeof google == 'undefined') {
          this.googleMapsLib();
        } else {
          this.mapInitialised = true;
        }
      }, 2000);

    };

    let onOffline = () => this.mapInitialised = false;

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }

  // Google Maps Browser
  public googleMapsLib() {
    // Create Google Maps in Browser
    let script = document.createElement('script');
    script.id  = 'gmaps';
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places,data,geometry&key=' + GOOGLE_MAPS_WEB;
    document.body.appendChild(script);

  }
  startExternalMap(location) {
      if (location.latitude) {
          this.platform.ready().then(() => {
              this.Geolocation.getCurrentPosition().then((position) => {
                  // ios
                  if (this.platform.is('ios')) {
                      window.open('maps://?q=' + location.name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + location.latitude + ',' + location.longitude, '_system');
                  };
                  // android
                  if (this.platform.is('android')) {
                      window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + location.latitude + ',' + location.longitude + '(' + location.name + ')', '_system');
                  };
              });
          });
      };
  }


  getLocation(force: boolean = false) {
    return new Promise((resolve, reject) => {
      this.storage.get('location').then(location => {
        console.log('cache location', JSON.parse(location))
        if (!force && location) {
          this.address = JSON.parse(location);
          resolve(this.address)
        } else {
          if (force || !this.address) {
            console.log('start location')
            this.Geolocation
                .getCurrentPosition()
                .then(pos => {
                  console.log('My location', pos.coords)
                  this.coords = pos.coords;
                  this.getAddressLocation({lat: this.coords.latitude, lng: this.coords.longitude})
                      .then(address => {
                        console.log('my address', address)
                        this.address = address;
                        this.storage.set('location', JSON.stringify(address));
                        let user = Parse.User.current();
                        if (user) {
                          Parse.Cloud.run('updateLocation', {address}).then(resolve, reject)
                        }
                        resolve(this.address)
                      })
                }).catch(error => {
              reject(error);
            });

          } else {
            resolve(this.address)
          }
        }

      })
    })
  }

  getUserLocation(force: boolean = false) {
      return new Promise((resolve, reject) => {
          this.storage.get('location').then(location => {
              console.log('cache location', JSON.parse(location))
              if (!force && location) {
                  this.address = JSON.parse(location);
                  resolve(this.address)
              } else {
                  if (force || !this.address) {
                      console.log('start location')
                      this.Geolocation
                          .getCurrentPosition()
                          .then(pos => {
                              console.log('My location', pos.coords)
                              this.coords = pos.coords;
                              this.getAddressLocation({ lat: this.coords.latitude, lng: this.coords.longitude })
                                  .then(address => {
                                      console.log('my address', address)
                                      this.address = address;
                                      this.storage.set('location', JSON.stringify(address));
                                     
                                      resolve(this.address)
                                  })
                          }).catch(error => {
                              reject(error);
                          });

                  } else {
                      resolve(this.address)
                  }
              }

          })
      })
  }

  checkLocation() {
    this.getLocation(true).then(address => {
      if (address && address['resume'] != this.address.resume) {
        this.events.publish('home:refresh')
      }
    })
  }


  // Load Google Maps Web App if online device
  init() {
    this.addConnectivityListeners();
    if (typeof google == 'undefined' || typeof google.maps == 'undefined') {

      console.log('Google maps JavaScript needs to be loaded.');
      this.disableMap();

      if (this.util.isOnline()) {
        console.log('online, loading map');

        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        };
        this.googleMapsLib();
      }
    } else {
      if (this.util.isOnline()) {
        console.log('showing map');
        this.initMap();
        this.enableMap();
      }
      else {
        console.log('disabling map');
        this.disableMap();
      }
    }
  }


  disableMap() {
    console.log('disable map');
  }

  enableMap() {
    console.log('enable map');
  }


  initMap() {
    this._geocoder = new google.maps.Geocoder();
    this._service  = new google.maps.places.AutocompleteService();
    this.loading   = false;
  }


  getAddress(address: string) {

    if (!this._geocoder) {
      this._geocoder = new google.maps.Geocoder();
    }

    return new Promise((resolve,
                        reject) => {
      this._geocoder.geocode({address: address}, (results,
                                                  status) => {
        let address = this.parseAddress(results[0]);
        resolve(address)
      });
    })
  }

  getAddressLocation(location: { lat: number, lng: number }) {
    if (!this._geocoder) {
      this._geocoder = new google.maps.Geocoder();
    }
    return new Promise(resolve => {
      this._geocoder.geocode({location}, (results) => resolve(this.parseAddress(results[0])));
    })
  }

  doCancel() {
    this.autocomplete.query = '';
  }

  doSearch() {
    if (this.autocomplete.query == '') {
      return;
    }
    if (this.autocomplete.query) {
      this.loading = true;
      this._data   = [];
      this._service.getPlacePredictions({input: this.autocomplete.query}, (predictions,
                                                                           status) => {
        predictions.map(
          item => this._data.push(item));
        setTimeout(() => this.loading = false, 1000)
      });
    }
  }

  parseAddress(location) {
    if (!location) {
      return {}
    }
    let address = {
      resume: '',
      geo   : {
        latitude : location.geometry.location.lat(),
        longitude: location.geometry.location.lng()
      }
    };

    console.log('parseaddress', location.address_components)


    for (var i = 0; i < location.address_components.length; i++) {
      var addressType = location.address_components[i].types[0];
      if (this.componentForm[addressType]) {
        var val = location.address_components[i][this.componentForm[addressType]];

        address[this.componentFormName[addressType]] = val;
      }
    }
    if (location.name) {
      address['place'] = location.name;
    }
    address['street']      = address['street'] + ', ' + address['number'];
    address['image']       = this.geraMapa(address.geo.latitude, address.geo.longitude, 18, 900, 500, 'marker');
    address['imageRegion'] = this.geraMapa(address.geo.latitude, address.geo.longitude, 16, 900, 500, 'fill');
    address.resume         = address['street'] + ' - ' + address['city'] + ', ' + address['state'] + ', ' + address['country'];
    return address;
  }

  geraMapa(lat, lng, zoom, w, h, type = 'fill') {
    let link = 'http://maps.googleapis.com/maps/api/staticmap' +
      '?center=' + lat + ',' + lng +
      '&zoom=' + zoom +
      '&scale=1' +
      '&size=' + w + 'x' + h +
      '&maptype=roadmap' +
      '&format=jpg' +
      '&visual_refresh=true';

    if (type == 'marker') {
      link += '&markers=size:small%7Ccolor:0xff2600%7Clabel:0%7C' + lat + ',' + lng;
    }
    //https://www.freemaptools.com/radius-around-point.htm
    //https://www.w3schools.com/tags/ref_urlencode.asp
    if (type == 'fill') {
      link += "&path=fillcolor:0x28A1CA|weight:0|color:0x28A1CA|enc:xxdoC`hs|G@eAFcAHaANcAP_AV_AZ}@%5Cy@b@y@d@u@h@q@l@o@n@k@p@g@t@c@t@_@x@[z@Wz@Qz@M|@I~@C|@?|@B|@H|@Lz@Pz@Vv@Zv@^r@b@r@f@n@j@j@n@h@p@f@t@`@x@^x@Z|@T~@R~@NbAH`ADbA@dAAbAEbAIbAO`AS~@U~@[|@_@x@a@x@g@t@i@p@k@n@o@j@s@f@s@b@w@^w@Z{@V{@P}@L}@H}@D}@?_AE}@I{@M{@Q{@Wy@[u@_@u@c@q@g@o@k@m@o@i@q@e@u@c@y@]y@[}@W_AQ_AOaAIcAGcAAcA"
    }

    return link;
  }


}
