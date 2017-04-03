import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class UrlSerializerHandlingIds extends DefaultUrlSerializer {
  serialize(tree: UrlTree): string {
    const r = super.serialize(tree);
    const parts = r.split('?');
    const queryPart = parts.length > 1 ? '?' + parts[1] : '';
    const segments = parts[0].split('/');
    return `${segments.map(decodeURIComponent).join('/')}${queryPart}`;
  }
}
