import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api-endpoint.config';

@Injectable({
  providedIn: 'root',
})
export class AiRecordService {
  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(API_BASE_URL + API_ENDPOINTS.ai_record, data);
  }
}
