import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class LangchainService {
  constructor(private http: HttpClient) {}

  predictSickness(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.langchain, data);
  }
}
