import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Login } from './login.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider
  ) {}

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(
      tap(() => this.accountService.identity(true).subscribe()),
      switchMap(() => this.accountService.identity())
    );
  }

  loginWithGoogle(): Observable<Account | null> {
    return this.authServerProvider.loginWithGoogle().pipe(
      tap(() => this.accountService.identity(true).subscribe()),
      switchMap(() => this.accountService.identity())
    );
  }

  loginWithFacebook(): Observable<Account | null> {
    return this.authServerProvider.loginWithFacebook().pipe(
      tap(() => this.accountService.identity(true).subscribe()),
      switchMap(() => this.accountService.identity())
    );
  }

  logout(): void {
    this.authServerProvider.logout().subscribe({
      complete: () => this.accountService.authenticate(null)
    });
  }
}
