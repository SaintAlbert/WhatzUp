// cdvphotolibrary.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'cdvphotolibrary' })
export class CDVPhotoLibraryPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    //transform(url: string) {
    //    if (this.startsWith(url, 'cdvphotolibrary://'))
    //        return url ? this.sanitizer.bypassSecurityTrustUrl(url) : url
    //    //return url.startsWith('cdvphotolibrary://') ? this.sanitizer.bypassSecurityTrustUrl(url) : url;
    //}

    //transform(v: string): SafeHtml {
    //    return this.sanitizer.bypassSecurityTrustUrl(v);
    //}

    public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url': return value.startsWith('cdvphotolibrary://') ? this.sanitizer.bypassSecurityTrustUrl(value) : value;
                //this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default: throw new Error(`Invalid safe type specified: ${type}`);
        }
    }

    // Starts with
    startsWith(str, word) {
        return str.lastIndexOf(word, 0) === 0;
    }

}