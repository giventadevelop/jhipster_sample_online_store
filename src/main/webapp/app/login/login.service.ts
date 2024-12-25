import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Account } from 'app/core/auth/account.model';
import { Login } from './login.model';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  login(credentials: Login): Observable<Account | null> {
    return this.http
      .post<any>(
        this.applicationConfigService.getEndpointFor('api/authenticate'),
        credentials
      )
      .pipe(
        map(() => this.createAccount(credentials.username))
      );
  }

  loginWithGoogle(): Observable<Account | null> {
    return this.authServerProvider.loginWithGoogle().pipe(
      map(() => {
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
      map(() => {
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

  private createAccount(username: string): Account {
    return {
      activated: true,
      email: username,
      firstName: '',
      langKey: 'en',
      lastName: '',
      login: username,
      imageUrl: '',
      authorities: ['ROLE_USER']
    };
  }
}
