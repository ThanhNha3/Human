import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

interface IUser {
  fullname: string;
  phone: string;
  password: string;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelperService = new JwtHelperService();
  constructor(private http: HttpClient, private router: Router) {}

  register(data: IUser): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.auth.register, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.auth.login, data);
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string {
    return localStorage.getItem('accessToken') || '';
  }

  isLoggedIn(): boolean {
    if (this.getAccessToken()) {
      const expired = this.jwtHelperService.isTokenExpired(
        this.getAccessToken()
      );
      if (expired) {
        localStorage.removeItem('accessToken');
      }
      return !expired;
    }
    return false;
  }

  redirectUser(role: string) {
    switch (role) {
      case 'user':
        this.router.navigate(['/']);
        break;
      case 'doctor':
        this.router.navigate(['/bac-si']);
        break;
      case 'pharmartist':
        this.router.navigate(['/duoc-si']);
        break;
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/auth/login']);
        break;
    }
  }

  isAccessTokenExpired(): boolean {
    return this.jwtHelperService.isTokenExpired(this.getAccessToken());
  }

  decodeToken(): any {
    return this.jwtHelperService.decodeToken(this.getAccessToken());
  }
}
