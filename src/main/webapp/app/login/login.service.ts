import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Login } from './login.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private authServerProvider: AuthServerProvider) {}

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(
      map(response => {
        if (!response) {
          return null;
        }
        const account: Account = {
          activated: true,
          email: credentials.username,
          firstName: '',
          langKey: 'en',
          lastName: '',
          login: credentials.username,
          imageUrl: '',
          authorities: ['ROLE_USER']
        };
        return account;
      })
    );
  }

  loginWithGoogle(): Observable<Account | null> {
    return this.authServerProvider.loginWithGoogle().pipe(
      map(response => {
        if (!response) {
          return null;
        }
        const account: Account = {
          activated: true,
          email: '',
          firstName: '',
          langKey: 'en',
          lastName: '',
          login: 'google-user',
          imageUrl: '',
          authorities: ['ROLE_USER']
        };
        return account;
      })
    );
  }

  loginWithFacebook(): Observable<Account | null> {
    return this.authServerProvider.loginWithFacebook().pipe(
      map(response => {
        if (!response) {
          return null;
        }
        const account: Account = {
          activated: true,
          email: '',
          firstName: '',
          langKey: 'en',
          lastName: '',
          login: 'facebook-user',
          imageUrl: '',
          authorities: ['ROLE_USER']
        };
        return account;
      })
    );
  }

  logout(): void {
    this.authServerProvider.logout().subscribe();
  }
}
