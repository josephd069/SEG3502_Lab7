
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { inject } from '@angular/core';

import { AuthenticationService } from './authentication.service';

export const loggedInGuard: CanActivateFn =
  (_route, state) => {

    const authentication = inject(AuthenticationService);
    const router = inject(Router);

    if (authentication.isLoggedIn()) {
      return true;
    }

    authentication.redirectUrl = state.url;

    return router.createUrlTree(['/login']);
  };
