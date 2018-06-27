import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'replaceLinefilter' })
export class ReplaceLineBreaks implements PipeTransform {
    transform(value: string): string {
        return value.replace(/\&/g, ' ');
    }
}