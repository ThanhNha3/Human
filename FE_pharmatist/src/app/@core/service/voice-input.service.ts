import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class VoiceInputService {
  constructor(private http: HttpClient) {}

  // getUnit(): Observable<any> {
  //   return this.http.get(apiBaseUrl + API_ENDPOINT.unit, {
  //     headers: new HttpHeaders().set(
  //       'authorization',
  //       'Bearer ' + this.authService.getToken() || ''
  //     ),
  //   });
  // }

  // getUnitById(id: number): Observable<any> {
  //   return this.http.get(apiBaseUrl + API_ENDPOINT.unit + `/${id}`);
  // }

  create(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.voice_input, data);
  }

  // updateUnit(data: IUnit, id: number): Observable<any> {
  //   return this.http.put(apiBaseUrl + API_ENDPOINT.unit + `/${id}`, data);
  // }

  // deleteUnit(id: number): Observable<any> {
  //   return this.http.delete(apiBaseUrl + API_ENDPOINT.unit + `/${id}`);
  // }
}
