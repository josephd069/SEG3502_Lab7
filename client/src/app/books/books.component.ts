
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  standalone: true,
  imports: [RouterOutlet, FormsModule]
})
export class BooksComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  submit(value: string): void {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    this.router.navigate(
      [id],
      { relativeTo: this.route }
    );
  }
}
