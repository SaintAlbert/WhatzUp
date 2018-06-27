import {Injectable} from "@angular/core";
import {SocialSharing} from "@ionic-native/social-sharing";

/*
 Generated class for the SocialShareProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class SocialShareProvider {

  constructor(private SocialSharing: SocialSharing) {
  }

  whatsappShare() {
    this.SocialSharing.shareViaWhatsApp("Message via WhatsApp", null /*Image*/, "http://pointdeveloper.com/" /* url */)
      .then(() => {
          alert("Success");
        },
        () => {
          alert("failed")
        })
  }

  twitterShare() {
    this.SocialSharing.shareViaTwitter("Message via Twitter", null /*Image*/, "http://pointdeveloper.com")
      .then(() => {
          alert("Success");
        },
        () => {
          alert("failed")
        })
  }

  facebookShare() {
    this.SocialSharing.shareViaFacebook("Message via Twitter", null /*Image*/, "http://pointdeveloper.com")
      .then(() => {
          alert("Success");
        },
        () => {
          alert("failed")
        })
  }

  otherShare() {
    this.SocialSharing.share("Genral Share Sheet", null/*Subject*/, null/*File*/, "http://pointdeveloper.com")
      .then(() => {
          alert("Success");
        },
        () => {
          alert("failed")
        })

  }

}
