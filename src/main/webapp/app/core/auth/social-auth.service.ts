import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from 'app/app.constants';
import { ISocialUser } from 'app/shared/model/social-user.model';

@Injectable({ providedIn: 'root' })
export class SocialAuthService {
  constructor(private http: HttpClient) {}

  loginWithGoogle(token: string): Observable<ISocialUser> {
    return this.http.post<ISocialUser>(`${SERVER_API_URL}api/auth/google`, { token });
  }

  loginWithFacebook(token: string): Observable<ISocialUser> {
    return this.http.post<ISocialUser>(`${SERVER_API_URL}api/auth/facebook`, { token });
  }
}
