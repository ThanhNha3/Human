import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class MedicineService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(API_BASE_URL + API_ENDPOINTS.medicine);
  }

  create(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.medicine, data);
  }

  getByMedicineName(name: string): Observable<any> {
    return this.http.get(
      API_BASE_URL + API_ENDPOINTS.medicine + `/search?name=${name}`
    );
  }
}
