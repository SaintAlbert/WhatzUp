

//  Modules
import {HttpModule} from "@angular/http";
import {MomentModule} from "angular2-moment";

import {TranslateModule} from "@ngx-translate/core";
import {DynamicFormsCoreModule} from "@ng2-dynamic-forms/core";
import {ReactiveFormsModule} from "@angular/forms";
import {TextMaskModule} from "angular2-text-mask";
import {FacebookService} from "ngx-facebook";
//import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { VirtualScrollModule } from '../components/virtual-scroll-component/virtual-scroll-component';
// Local Modules
import {IonPhotoModule} from "../modules/ion-photo/ion-photo.module";
import {AuthModule} from "../modules/auth/auth.module";
import {DynamicFormsIonicUIModule} from "../modules/ui-dynaimc-form-ionic/src/ui-ionic.module";
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ObjectFitImagesModule } from 'heilbaum-ionic-object-fit-images';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { NguiReactModule } from '@ngui/react';

// Providers
import {LocalStorageProvider} from "../providers/local-storage/local-storage";
import {ExternalLibProvider} from "../providers/external-lib/external-lib";
import {LoggingProvider} from "../providers/logging/logging";
import {AuthProvider} from "../providers/auth/auth";
import {UserProvider} from "../providers/user/user";
import {UserDataProvider} from "../providers/user-data/user-data";
import {GalleryProvider} from "../providers/gallery/gallery";
import {UpcomingProvider } from '../providers/upcoming/upcoming';
import {GalleryAlbumProvider} from "../providers/gallery-album/gallery-album";
import {GalleryActivityProvider} from "../providers/gallery-activity/gallery-activity";
import {GalleryCommentProvider} from "../providers/gallery-comment/gallery-comment";
import {UpcomingCommentProvider } from '../providers/upcoming-comment/upcoming-comment';
import {GallerFeedbackProvider} from "../providers/gallery-feedback/gallery-feedback";
import {UpcomingFeedbackProvider} from "../providers/upcoming-feedback/upcoming-feedback";
import {ParseFileProvider} from "../providers/parse-file/parse-file";
import {ParsePushProvider} from "../providers/parse-push/parse-push";
import {HandyManProvider} from "../providers/handyman/handyman-service";
import {HandyCommentProvider} from "../providers/handyman/handy-comment";
import {HandyManBookingProvider} from "../providers/handyman/handyman-booking";
//


import {ChatChannelProvider} from "../providers/chat-channel/chat-channel";
import {ChatMessageProvider} from "../providers/chat-message/chat-message";
import {AnalyticsProvider} from "../providers/analytics/analytics";
import {IonicUtilProvider} from "../providers/ionic-util/ionic-util";
import { SocketConectionProvider } from '../providers/socket-conection/socket-conection';
import { ImageLoaderConfig } from '../providers/image-loader-config/image-loader-config';
import { ImageLoaderProvider } from '../providers/image-loader/image-loader';
import {CameraUtils} from '../providers/camera-util/camera-utils';


//import {PushProvider} from "../providers/push/push";
import {GmapProvider} from "../providers/gmap/gmap";
// Ionic native providers
import {Facebook} from "@ionic-native/facebook";
import {Device} from "@ionic-native/device";
import {Geolocation} from "@ionic-native/geolocation";
import {Camera} from "@ionic-native/camera";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {SocialSharing} from "@ionic-native/social-sharing";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {Keyboard} from "@ionic-native/keyboard";
import {OneSignal} from "@ionic-native/onesignal";
import { Stripe } from '@ionic-native/stripe';
import {Push} from "@ionic-native/push";
import { AppVersion } from '@ionic-native/app-version';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { NativeAudio } from '@ionic-native/native-audio';
import { ImageCompressService, ResizeOptions, ImageUtilityService } from 'ng2-image-compress';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SMS } from '@ionic-native/sms';
import { InAppBrowser } from '@ionic-native/in-app-browser';


// Pipes
import {CapitalizePipe} from "../pipes/capitalize";
import {OrderByPipe} from "../pipes/order-by";
import {AscPipe} from "../pipes/asc";
import {MyCurrencyPipe} from "../pipes/mycurrency";
import {DescPipe} from "../pipes/desc";
import {CDVPhotoLibraryPipe} from "../pipes/cdvphotolibrary.pipe";
import {ReplaceLineBreaks} from "../pipes/replacefilter";
import { GroupByPipe } from '../pipes/group-by/group-by';


// Components
import {LoaderComponent} from "../components/loader/loader";
import {AddressInputComponent} from "../components/address-input/address-input";
import {PhotoGridComponent} from "../components/photo-grid/photo-grid";
import {PhotoMapComponent} from "../components/photo-map/photo-map";
import {PhotoListComponent} from "../components/photo-list/photo-list";
import {PhotoCardComponent} from "../components/photo-card/photo-card";
import {PhotoCardDetailComponent} from "../components/photo-card-detail/photo-card-detail";
import {AlbumGridComponent} from "../components/album-grid/album-grid";
import {AlbumInputComponent} from "../components/album-input/album-input";
import {BookmarkPhotoGridComponent} from "../components/bookmark-photo-grid/bookmark-photo-grid";
import {UserListComponent} from "../components/user-list/user-list";
import {MapGalleryComponent} from "../components/map-gallery/map-gallery";
import {EmptyViewComponent} from "../components/empty-view/empty-view";
import {CategoryComponent } from '../components/category/category';
import {UpcomingListComponent } from '../components/upcoming-list/upcoming-list';
import {UpcomingCardComponent } from '../components/upcoming-card/upcoming-card';
import {UpcomingDetailCardComponent } from '../components/upcoming-detail-card/upcoming-detail-card';
import {CreditCardComponent } from '../components/credit-card/credit-card';
import {LiveShowComponent } from '../components/live-show/live-show';
import {ImgLoader } from '../components/img-loader/img-loader';
import { ContentDrawerComponent } from '../components/content-drawer/content-drawer';
import { PhotoFilterComponent } from '../components/photo-filter/photo-filter.ts';


//import { VirtualScrollComponent } from '../components/virtual-scroll-component/virtual-scroll-component';



// Directives
import {FocusDirective} from "../directives/focus/focus";
import {MyCurrencyFormatterDirective} from "../directives/currency/currency";
import {AutosizeDirective} from "../directives/autosize/autosize";
import {ContenteditableModel} from "../directives/contenteditablemodel/contenteditablemodel";
//import {ScrollHideDirective} from "../directives/scrollhideheader/scrollhideheader";
//import { CreditCardDirectivesModule } from 'ng2-cc-library'
// Import your library



// Modules
export const Modules = [
    HttpModule,
    TranslateModule,
    MomentModule,
    ReactiveFormsModule,
    DynamicFormsCoreModule,
    TextMaskModule,
    //CreditCardDirectivesModule,
    VirtualScrollModule,
    // Local Modules
    DynamicFormsIonicUIModule,
    AuthModule,
    IonPhotoModule,
    LazyLoadImagesModule,
    Ng2ImgMaxModule,
    ObjectFitImagesModule,
    IonicImageViewerModule,
    NguiReactModule,

]
// Directives
export const Directives = [
    AutosizeDirective,
    FocusDirective,
    MyCurrencyFormatterDirective,
    ContenteditableModel,
    //ScrollHideDirective,
    //ImageViewer,
    
]
// Components
export const Components = [
    LoaderComponent,
    AddressInputComponent,
    PhotoGridComponent,
    PhotoMapComponent,
    PhotoListComponent,
    PhotoCardComponent,
    PhotoCardDetailComponent,
    AlbumGridComponent,
    AlbumInputComponent,
    BookmarkPhotoGridComponent,
    UserListComponent,
    MapGalleryComponent,
    EmptyViewComponent,
    CategoryComponent,
    UpcomingListComponent,
    UpcomingCardComponent,
    UpcomingDetailCardComponent,
    CreditCardComponent,
    LiveShowComponent,
    ImgLoader,
    ContentDrawerComponent,
    PhotoFilterComponent,
  
    //VirtualScrollComponent,
]

// Pipes
export const Pipes = [
    CapitalizePipe,
    OrderByPipe,
    ReplaceLineBreaks,
    AscPipe,
    MyCurrencyPipe,
    DescPipe,
    CDVPhotoLibraryPipe,
    GroupByPipe,
]

// Providers
export const Providers = [
      ImageLoaderConfig,
    ImageLoaderProvider,
    CameraUtils,
    AnalyticsProvider,
    AuthProvider,
    ChatChannelProvider,
    ChatMessageProvider,
    GmapProvider,
    ExternalLibProvider,
    GalleryProvider,
    UpcomingProvider,
    GalleryAlbumProvider,
    GalleryActivityProvider,
    GalleryCommentProvider,
    UpcomingCommentProvider,
    GallerFeedbackProvider,
    UpcomingFeedbackProvider,
    ParseFileProvider,
    ParsePushProvider,
    HandyManProvider,
    HandyCommentProvider,
    HandyManBookingProvider,
    LocalStorageProvider,
    LoggingProvider,
    IonicUtilProvider,
    //PushProvider,
    FacebookService,
    UserProvider,
    UserDataProvider,
    SocketConectionProvider,
    ImageCompressService, ResizeOptions,
    //Native
    Facebook,
    Device,
    Geolocation,
    Camera,
    //CameraPreview,
    StatusBar,
    SplashScreen,
    SocialSharing,
    GoogleAnalytics,
    Keyboard,
    OneSignal,
    Stripe,
    Push,
    AppVersion,
    PhotoLibrary,
    //Flashlight,
    NativeAudio,
    LaunchNavigator,
    SMS,
    InAppBrowser,
]

