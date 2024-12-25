import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Log, LogService } from '../shared/log/log.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApplicationConfigService } from '../core/config/application-config.service';
import { LoginService } from './login.service';
import { AuthServerProvider } from '../core/auth/auth-jwt.service';
import { AccountService } from '../core/auth/account.service';
import { Account } from '../core/auth/account.model';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  authenticationError = false;
  private log = LogService.create(this.constructor.name);

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.log.debug('Login attempt', this.loginForm.value);

      this.loginService
        .login({
          username: this.loginForm.get('username')!.value,
          password: this.loginForm.get('password')!.value,
          rememberMe: this.loginForm.get('rememberMe')!.value,
        })
        .subscribe({
          next: (account) => {
            this.authenticationError = false;
            this.accountService.authenticate(account);
            if (!this.router.getCurrentNavigation()) {
              // There's no redirect URL, so go to home page
              this.router.navigate(['']);
            }
          },
          error: () => {
            this.authenticationError = true;
          },
        });
    }
  }

  private handleLoginSuccess(account: Account | null): void {
    this.authenticationError = false;
    this.accountService.authenticate(account);
    if (!this.router.getCurrentNavigation()) {
      this.router.navigate(['']);
    }
  }

  private handleLoginError(): void {
    this.authenticationError = true;
  }

  loginWithGoogle(): void {
    this.log.debug('Google login attempt');
    this.loginService.loginWithGoogle().subscribe({
      next: account => this.handleLoginSuccess(account),
      error: () => this.handleLoginError(),
    });
  }

  loginWithFacebook(): void {
    this.log.debug('Facebook login attempt');
    this.loginService.loginWithFacebook().subscribe({
      next: account => this.handleLoginSuccess(account),
      error: () => this.handleLoginError(),
    });
  }
}
