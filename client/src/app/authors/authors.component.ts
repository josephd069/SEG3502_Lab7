
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Author } from '../books/model/book';
import { BooksService } from '../books/service/books.service';

@Component({
    selector: 'app-authors',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './authors.component.html',
    styleUrls: ['./authors.component.css']
})
export class AuthorsComponent {

    private booksService = inject(BooksService);

    author: Author | null = null;
    errorMessage = '';
    loading = false;

    searchAuthor(value: string): void {
        const id = Number(value);

        this.author = null;
        this.errorMessage = '';

        if (!Number.isInteger(id) || id <= 0) {
            this.errorMessage = "Veuillez entrer un ID d'auteur valide.";
            return;
        }

        this.loading = true;

        this.booksService.getAuthorById(id).subscribe({
            next: (data: Author) => {
                this.author = data;
                this.loading = false;
            },

            error: (error: HttpErrorResponse) => {
                this.loading = false;

                if (error.status === 404) {
                    this.errorMessage =
                        `Aucun auteur trouvé avec l'ID ${id}.`;
                } else {
                    this.errorMessage =
                        "Erreur lors de la recherche de l'auteur.";
                }
            }
        });
    }
}
