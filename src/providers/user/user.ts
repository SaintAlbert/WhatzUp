import {Injectable} from "@angular/core";
import {Events} from "ionic-angular";
import {IonicUtilProvider} from "../ionic-util/ionic-util";
import {IUserFollow} from "../../models/user.model";
import {LocalStorageProvider} from "../local-storage/local-storage";
import Parse from "parse";

@Injectable()
export class UserProvider {

  data: any[]      = [];
  cordova: boolean = false;

  constructor(private util: IonicUtilProvider,
              private events: Events,
              private Storage: LocalStorageProvider) {
    this.cordova = this.util.cordova;

  }

  current(): any {
    let user = Parse.User.current();
    return user;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      if (Parse.User.current()) {
        Parse.User.current().fetch().then(resolve, reject);
      } else {
        reject();
      }
    });
  }

  setLanguage(lang: any = 'en'): Promise<any> {
    return new Promise((resolve, reject) => {
      let user = Parse.User.current();
      user.set('lang', lang);
      user.save().then(resolve, reject)
    })
  }


  update(form: any) {
    return new Promise((resolve, reject) => {
      Parse.User.current().save(form).then(resolve, reject)
    })
  }

  updatePhoto(parseFile) {
    return new Promise((resolve, reject) => {
      let user = Parse.User.current();
      user.set('photo', parseFile);
      user.save().then(resolve, reject)
    })
  }

  recoverPassword(email: string) {
    return new Promise((resolve, reject) => {
      Parse.User.requestPasswordReset(email).then(resolve, reject)
    })
  }

  getFacebookListUsers(users: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('getFacebookListUsers', {users: users}).then(resolve, reject)
    })
  }

  getProfile(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('profile', {username}).then(resolve, reject);
    })

  }

  updateAvatar(photo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('updateAvatar', {photo: photo}).then(resolve, reject);
    })
  }

  logout(): void {
    // let user = Parse.User.current();
    // this.ParsePush.unsubscribe(user.get('username'));
    this.events.unsubscribe('upload:gallery');
    Parse.User.logOut();
  }

  updateWithFacebookData(): Promise<any> {
    return new Promise((resolve, reject) => {
      let currentUser = null;
      Parse.Cloud.run('saveFacebookPicture')
        .then(user => currentUser = user)
        .then(() => {
          // Push
          // this.ParsePush.init()
          resolve(currentUser)
        }, reject);
    })
  }

  facebookSyncProfile(fbData: any) {
    return new Promise((resolve, reject) => {
      let currentUser = Parse.User.current();

      if (!currentUser.get('facebook') && fbData.id) {
        currentUser.set('facebook', fbData.id);
      }

      if (!currentUser.get('email') && fbData.email) {
        currentUser.set('email', fbData.email);
      }

      if (!currentUser.get('name') && fbData.name) {
          currentUser.set('name', fbData.name);
          currentUser.set('username', fbData.name)
      }

      if (!currentUser.get('gender') && fbData.gender) {
        currentUser.set('gender', fbData.gender);
      }

      if (!currentUser.get('birthdate') && fbData.birthday) {
        currentUser.set('birthdate', new Date(fbData.birthday));
      }

      currentUser.save().then(resolve, reject);
    })
  }

  signUp(data):Promise<any> {
    return new Promise((resolve, reject) => {
      let user      = new Parse.User();
      user.signUp(data).then(resolve, reject);
    })

  }

  signIn(obj) {
    return new Promise((resolve, reject) => {
      let currentUser = null
      Parse.User
        .logIn(obj.username, obj.password)
        .then(_user => currentUser = _user)
        .then(() => this.Storage.get('lang'))
        .then(this.setLanguage)
        .then(() => resolve(currentUser), reject)
    });
  }


  changePassword(password: string) {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('changePassword', {password}).then(resolve, reject)
    })
  }

  destroy(data) {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('destroyUser', data).then(resolve, reject)
    })
  }


  follow(params: IUserFollow): Promise<any> {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('followUser', params).then(resolve, reject);
    })
  }


  list(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('listUsers', params).then(resolve, reject);
    })
  }

  // Following

  getFollowing(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Parse.Cloud.run('getFollowing', {username}).then(resolve, reject);
    })

  }

  validSession(): boolean {
    let user = Parse.User.current();
    return (user.get('email') && user.get('username').indexOf('@') > -1 && user.get('address'))
  }


}
