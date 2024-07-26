import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  // getUnit(): Observable<any> {
  //   return this.http.get(apiBaseUrl + API_ENDPOINT.unit, {
  //     headers: new HttpHeaders().set(
  //       'authorization',
  //       'Bearer ' + this.authService.getToken() || ''
  //     ),
  //   });
  // }

  getById(id: number | string): Observable<any> {
    return this.http.get(API_BASE_URL + API_ENDPOINTS.user + `/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.user, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  update(data: any, id: number | string): Observable<any> {
    return this.http.patch(API_BASE_URL + API_ENDPOINTS.user + `/${id}`, data);
  }

  // deleteUnit(id: number): Observable<any> {
  //   return this.http.delete(apiBaseUrl + API_ENDPOINT.unit + `/${id}`);
  // }
}
