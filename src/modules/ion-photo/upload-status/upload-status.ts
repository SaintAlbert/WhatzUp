import { Component } from '@angular/core'
import { Events } from 'ionic-angular'
import _ from 'underscore'
import { IUpload } from './upload.model'
import {GalleryProvider} from '../../../providers/gallery/gallery';
import {UpcomingProvider} from '../../../providers/upcoming/upcoming';
//import Parse from "parse";


@Component({
  selector: 'upload-status',
  templateUrl: 'upload-status.html',
})
export class UploadStatusComponent {

  uploads: any[]   = []
  loading: boolean = false
  typeupcoming: boolean = false

  constructor(private events: Events, public provider: GalleryProvider, public upProvider: UpcomingProvider) {
      this.events.unsubscribe('upload:gallery', null);
      this.events.unsubscribe('uploadupcoming:gallery', null);
      this.events.subscribe('upload:gallery', item => this.add(item))
      this.events.subscribe('uploadupcoming:gallery', item => this.addUpcoming(item))
  }

  add(item: IUpload) {
      this.typeupcoming = false;
    console.log('uploadProccess', item)
    let newItem = {loading: true, form: item.form, status: 'sending', code: new Date().getTime()}
    this.uploads.push(newItem)
    let index = _.findIndex(this.uploads, {code: newItem.code})
    this.process(index)
  }

  addUpcoming(item: IUpload) {
      this.typeupcoming = true;
      console.log('uploadProccess', item)
      let newItem = { loading: true, form: item.form, status: 'sending', code: new Date().getTime() }
      this.uploads.push(newItem)
      let index = _.findIndex(this.uploads, { code: newItem.code })
      this.processUpcoming(index)
  }

  process(index: number): void {
     
    let newItem                 = this.uploads[index]
    this.uploads[index].loading = true

    this.provider.createGallery(newItem.form).then(item => {
      console.log(item)
      newItem.loading = false
      this.uploads.splice(index, 1)
      this.events.publish('tabHome', 2)
      //this.events.publish('home:reload')
    }).catch(error => {
      console.log(error)
      this.uploads[index].loading = false
      this.events.publish('tabHome', 2)
      //this.events.publish('home:reload')
    })
  }

  processUpcoming(index: number): void {
    
      let newItem = this.uploads[index]
      this.uploads[index].loading = true

      this.upProvider.createUpcoming(newItem.form).then(item => {
          console.log(item)
          newItem.loading = false
          this.uploads.splice(index, 1)
          this.events.publish('tabHome', 1)
          //this.events.publish('home:reload')

      }).catch(error => {
          console.log(error)
          this.uploads[index].loading = false
          this.events.publish('tabHome', 1)
          //this.events.publish('home:reload')
      })
  }

  retry(index): void {
          this.process(index)
  }

  cancel(index, item): void {
    console.log(index, item)
    this.uploads.splice(index, 1)
  }

  retryUpcoming(index): void {
      this.processUpcoming(index)
  }

  cancelUpcoming(index, item): void {
      console.log(index, item)
      this.uploads.splice(index, 1)
  }

  getRandomInt(min: number = 0, max: number = 9999) {
    return Math.floor(Math.random() * (max - min)) + min
  }


}
