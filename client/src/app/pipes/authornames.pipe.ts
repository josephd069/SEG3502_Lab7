
import { Pipe, PipeTransform } from '@angular/core';
import { Author } from '../books/model/book';

@Pipe({
  name: 'authornames',
  standalone: true
})
export class AuthornamesPipe implements PipeTransform {

  transform(value: Author[] | undefined): string {

    if (!value?.length) {
      return 'Aucun auteur associé';
    }

    return value
      .map(a => `${a.firstName} ${a.lastName}`)
      .join(' et ');
  }
}
