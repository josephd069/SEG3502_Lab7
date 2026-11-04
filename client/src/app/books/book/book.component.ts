
import {
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';

import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { Book } from '../model/book';
import { BooksService } from '../service/books.service';
import { AuthornamesPipe } from '../../pipes/authornames.pipe';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  standalone: true,
  imports: [NgIf, AuthornamesPipe]
})
export class BookComponent implements OnInit, OnDestroy {

  selectedBook: Book | null = null;
  loading = true;
  errorMessage = '';

  private route = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(

      switchMap(params => {

        this.loading = true;
        this.selectedBook = null;
        this.errorMessage = '';

        const id = Number(params.get('id'));

        if (!Number.isInteger(id) || id <= 0) {
          this.errorMessage =
            'Veuillez saisir un identifiant valide.';

          return of(null);
        }

        return this.booksService.getBook(String(id)).pipe(

          catchError((error: HttpErrorResponse) => {

            this.errorMessage = error.status === 404
              ? `Aucun livre trouvé avec l'identifiant ${id}.`
              : 'Impossible de joindre le serveur pour rechercher ce livre.';

            return of(null);
          })
        );
      })

    ).subscribe(book => {
      this.selectedBook = book;
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  categoryLabel(category: string): string {

    const translations: Record<string, string> = {
      Kids: 'Enfants',
      Tech: 'Technologie',
      Cook: 'Cuisine'
    };

    return translations[category] ?? category;
  }
}
