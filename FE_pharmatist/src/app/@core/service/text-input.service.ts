import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class TextInputService {
  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.text_input, data);
  }
}
