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
      map(() => ({ 
        activated: true,
        email: credentials.username,
        firstName: '',
        langKey: 'en',
        lastName: '',
        login: credentials.username,
        imageUrl: ''
      }))
    );
  }

  loginWithGoogle(): Observable<Account | null> {
    return this.authServerProvider.loginWithGoogle().pipe(
      map(() => ({ 
        activated: true,
        email: '',
        firstName: '',
        langKey: 'en',
        lastName: '',
        login: 'google-user',
        imageUrl: ''
      }))
    );
  }

  loginWithFacebook(): Observable<Account | null> {
    return this.authServerProvider.loginWithFacebook().pipe(
      map(() => ({ 
        activated: true,
        email: '',
        firstName: '',
        langKey: 'en',
        lastName: '',
        login: 'facebook-user',
        imageUrl: ''
      }))
    );
  }

  logout(): void {
    this.authServerProvider.logout().subscribe();
  }
}
