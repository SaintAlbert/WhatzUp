import {Injectable} from "@angular/core";

//declare var Parse: any;
import Parse from "parse";

@Injectable()
export class ParseFileProvider {

  private _file: any;
  private _filename: string = 'file.jpg'

  constructor() {

  }


  upload(file: any, ext?): Promise<any> {
      console.log(file)
    return new Promise((resolve, reject) => {
      this._file = file;

      if (ext) {
          this._filename.replace('.jpeg', ext);
      }

      new Parse.File('image.jpeg', file).save().then(resolve, reject);
    })
  }
}
