
import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [NgIf, FormsModule]
})
export class LoginComponent {

  username = '';
  password = '';
  message = '';

  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) {}

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  get loggedUser(): string {
    return this.auth.getUser() ?? '';
  }

  checkLogin(): void {

    this.message = '';

    if (!this.auth.login(this.username, this.password)) {

      this.message =
        'Identifiant ou mot de passe incorrect.';

      return;
    }

    const destination =
      this.auth.redirectUrl || '/admin';

    this.auth.redirectUrl = null;
    this.password = '';

    this.router.navigateByUrl(destination);
  }

  logout(): void {

    this.auth.logout();

    this.username = '';
    this.password = '';

    this.router.navigateByUrl('/login');
  }
}
