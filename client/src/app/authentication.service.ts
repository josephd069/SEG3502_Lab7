
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  redirectUrl: string | null = null;

  // Compte de démonstration local.
  login(user: string, password: string): boolean {

    if (
      user.trim() === 'admin' &&
      password === 'password'
    ) {
      sessionStorage.setItem('username', 'admin');
      return true;
    }

    return false;
  }

  logout(): void {
    sessionStorage.removeItem('username');
    this.redirectUrl = null;
  }

  getUser(): string | null {
    return sessionStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
