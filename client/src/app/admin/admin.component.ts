
import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { from, of } from 'rxjs';

import {
  concatMap,
  map,
  switchMap,
  toArray
} from 'rxjs/operators';

import { Author, Book } from '../books/model/book';
import { BooksService } from '../books/service/books.service';

function categoryValidator(
  control: AbstractControl
): ValidationErrors | null {

  return ['Kids', 'Tech', 'Cook'].includes(control.value)
    ? null
    : { invalidCategory: true };
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule]
})
export class AdminComponent {

  private builder = inject(FormBuilder);
  private booksService = inject(BooksService);

  message = '';
  messageType: 'success' | 'error' = 'success';
  isSubmitting = false;

  bookForm = this.builder.group({

    category: [
      '',
      [Validators.required, categoryValidator]
    ],

    title: ['', Validators.required],

    cost: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]
    ],

    authors: this.builder.array([]),

    year: ['', [
      Validators.required,
      Validators.min(1)
    ]],

    description: ['', Validators.required]

  });

  get category(): AbstractControl {
    return this.bookForm.get('category')!;
  }

  get title(): AbstractControl {
    return this.bookForm.get('title')!;
  }

  get cost(): AbstractControl {
    return this.bookForm.get('cost')!;
  }

  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  addAuthor(): void {

    this.authors.push(
      this.builder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required]
      })
    );
  }

  removeAuthor(index: number): void {
    this.authors.removeAt(index);
  }

  onSubmit(): void {

    if (this.bookForm.invalid || this.isSubmitting) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    let createdId: number | null = null;

    const form = this.bookForm.getRawValue();

    const book = new Book(
      0,
      form.category!,
      form.title!,
      Number(form.cost),
      [],
      Number(form.year),
      form.description!
    );

    const authorNames = (
      form.authors || []
    ) as {
      firstName: string;
      lastName: string;
    }[];

    this.booksService.addBook(book).pipe(

      switchMap(savedBook => {

        createdId = savedBook.id;

        if (authorNames.length === 0) {
          return of(savedBook);
        }

        return from(authorNames).pipe(

          concatMap(author =>

            this.booksService.getAuthorsNamed(
              author.firstName,
              author.lastName
            ).pipe(

              switchMap((
                matches: Author[] | undefined
              ) => {

                const existing = matches?.[0];

                return existing

                  ? this.booksService.updateBookAuthors(
                      savedBook.id,
                      existing.id
                    )

                  : this.booksService.addBookAuthor(
                      savedBook.id,
                      {
                        id: 0,
                        firstName: author.firstName,
                        lastName: author.lastName
                      }
                    );
              })
            )
          ),

          toArray(),

          map(() => savedBook)
        );
      })

    ).subscribe({

      next: savedBook => {

        this.messageType = 'success';

        this.message =
          `Livre « ${savedBook.title} » ajouté avec succès (ID ${savedBook.id}).`;

        this.bookForm.reset();
        this.authors.clear();
        this.isSubmitting = false;
      },

      error: () => {

        this.messageType = 'error';

        this.message = createdId === null
          ? 'Impossible d’ajouter le livre. Vérifiez le serveur Spring Boot.'
          : `Le livre ${createdId} a été créé, mais l’association des auteurs a échoué.`;

        this.isSubmitting = false;
      }
    });
  }
}
